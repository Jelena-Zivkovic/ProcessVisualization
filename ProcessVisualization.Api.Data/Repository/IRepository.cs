using ProcessVisualization.Api.Data.Models;

namespace ProcessVisualization.Api.Data.Repository
{
    public interface IRepository<T, K> where T : class, IEntity<K>
    {
        Task<List<T>> GetAll();
        Task<T> Get(K id);
        Task<T> Add(T entity);
        Task<T> Update(T entity);
        Task<T> Delete(K id);
    }
}
