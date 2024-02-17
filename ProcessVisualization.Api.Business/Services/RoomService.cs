﻿using ProcessVisualization.Api.Business.Services.Interfaces;
using ProcessVisualization.Api.Contracts.DataTransferObjects;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Documents;
using ProcessVisualization.Api.Contracts.DataTransferObjects.Room;
using ProcessVisualization.Api.Contracts.DataTransferObjects.User;
using ProcessVisualization.Api.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace ProcessVisualization.Api.Business.Services
{
    public class RoomService : IRoomService
    {
        internal readonly RoomRepository _roomRepository;
        internal readonly UserRepository _userRepository;
        internal readonly DocumentRepository _documentRepository;
        internal readonly RoomUserRepository _roomUserRepository;
        public RoomService(RoomRepository roomRepository, UserRepository userRepository, DocumentRepository documentRepository,
            RoomUserRepository roomUserRepository)
        {
            _roomRepository = roomRepository;
            _userRepository = userRepository;
            _documentRepository = documentRepository;
            _roomUserRepository = roomUserRepository;
        }

        public ResponseTemplateDto<RoomViewDto> CreateRoom(string roomName, string userId)
        {
            var allRooms = _roomRepository.GetAll();
            if (allRooms.Result.Exists(x => x.Name == roomName))
            {
                return new ResponseTemplateDto<RoomViewDto>(false, "Alredy exist room with name: " + roomName);
            }

            var roomCode = DateTime.UtcNow.Ticks.ToString("X") +"_" + roomName;
            var newRoom = new Data.Models.Room
            {
                CreatedAt = DateTime.UtcNow,
                Name = roomName,
                RoomCode = roomCode,
                Description = roomName,
            };

            var res = _roomUserRepository.Add(new Data.Models.RoomUser
            {
                Room = newRoom,
                UserId = userId,
                isAdmin = true
            });

            return new ResponseTemplateDto<RoomViewDto>(true, new RoomViewDto
            {
                Description = newRoom.Description,
                CreatedAt = newRoom.CreatedAt,
                Id = newRoom.Id,
                ImageUrl = newRoom.ImageUrl,
                LastUpdatedAt = newRoom.CreatedAt,
                Name = newRoom.Name
            });
        }

        public List<RoomViewDto> GetAll(string userId)
        {
            var roomIds = _roomUserRepository.GetAll().Result.Where(x => ( userId == x.UserId  && x.isActive)).Select(x => x.RoomId).ToList();
            var rooms = _roomRepository.GetAll();
            return rooms.Result.Where(x => roomIds.Contains(x.Id)).Select(r => new RoomViewDto { 
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                ImageUrl = r.ImageUrl,
                CreatedAt = r.CreatedAt,
                LastUpdatedAt = r.LastUpdatedAt                
            }).ToList();
        }

        public RoomDetailsViewDto GetByIdAsync(int id)
        {
            var room = _roomRepository.Get(id).Result;
            if(room == null)
            {
                return null;
            }

            var result = new RoomDetailsViewDto();
            result.Id = room.Id;
            result.Name = room.Name; 
            result.Description = room.Description;
            result.ImageUrl = room.ImageUrl;
            result.CreatedAt = room.CreatedAt;
            result.LastUpdatedAt = room.LastUpdatedAt;
            result.Users = room.RoomUsers.Where(x => x.isActive).Select(x => new UserDto
            {
                Email = x.User.Email,
                Id = x.User.Id,
                ImageBase64 =  string.Empty,
                Name = x.User.Name
            }).ToList();
            result.Documents = room.Documents.Select(x => new DocumentViewDto {
                Id = x.Id,
                Name = x.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.LastUpdatedAt,
            }).ToList();
            

            return result;
        }

        public ResponseTemplateDto<RoomViewDto> JoinRoom(string roomCode, string email)
        {
            var user = _userRepository.GetUsersByEmailAsync(email).Result;

            if (user == null) {
                return new ResponseTemplateDto<RoomViewDto>(false, "User with email: " + email + ". The user needs to be registered to join the room.");
            }

            var room = _roomRepository.GetByCode(roomCode).Result; 
            if (room == null) {
                return new ResponseTemplateDto<RoomViewDto>(false, "The room code doesn't exist.");
            }

            var roomUser = user.RoomUsers.Where(x => x.RoomId == room.Id).FirstOrDefault();
            if (roomUser == null)
            {
                var res = _roomUserRepository.Add(new Data.Models.RoomUser
                {
                    RoomId = room.Id,
                    UserId = user.Id,
                    isAdmin = false,
                    isActive = true
                }).Result;
            }
            else {
                roomUser.isActive = true;
                roomUser = _roomUserRepository.Update(roomUser).Result;
            }

            return new ResponseTemplateDto<RoomViewDto>();
        }

        public ResponseTemplateDto<int> LeaveRoom(int roomId, string userEmail)
        {
            var roomUser = _userRepository.GetUsersByEmailAsync(userEmail).Result;

            var ru =  roomUser.RoomUsers.Where(x => x.RoomId == roomId).FirstOrDefault();
            if (ru != null)
            {
                ru.isActive = false;
                ru = _roomUserRepository.Update(ru).Result;
            }

            return new ResponseTemplateDto<int>();
        }
    }
}
