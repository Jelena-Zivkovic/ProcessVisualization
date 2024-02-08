using System.Security.Claims;

namespace ProcessVisualization.Api.Host.Extensions
{
    internal static class Extensions
    {

        internal static long TryGetUserId(this ClaimsPrincipal user)
        {
            var userId = user.Claims.Where(c => c.Type == "id").FirstOrDefault();
            if (userId == null)
            {
                return 0;
            }
            return Convert.ToInt64(userId.Value);
        }

        internal static string GetUserId(this ClaimsPrincipal user)
        {
            var userId = user.Claims.Where(c => c.Type == "id").FirstOrDefault();
            if (userId == null)
            {
                return string.Empty;
                throw new Exception("Unauthorized");
            }
            return userId.Value;
        }
    }
}
