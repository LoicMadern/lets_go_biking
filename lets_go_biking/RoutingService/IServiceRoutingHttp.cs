using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Threading.Tasks;

namespace RoutingService
{
    [ServiceContract]
    public interface IServiceRoutingHttp
    {
        [OperationContract]
        [WebInvoke(Method = "GET",
            ResponseFormat = WebMessageFormat.Json,
            BodyStyle = WebMessageBodyStyle.Wrapped,
            UriTemplate = "getClosestStation?lat={x}&long={y}")]
        float[] getClosestStation(float x, float y);

        [OperationContract]
        [WebInvoke(Method = "GET",
         ResponseFormat = WebMessageFormat.Json,
         BodyStyle = WebMessageBodyStyle.Bare,
         UriTemplate = "getWalkingPath?lat1={lat1}&long1={long1}&lat2={lat2}&long2={long2}")]
        Stream getWalkingPath(string lat1, string long1, string lat2, string long2);

        [OperationContract]
        [WebInvoke(Method = "GET",
         ResponseFormat = WebMessageFormat.Json,
         BodyStyle = WebMessageBodyStyle.Bare,
         UriTemplate = "getCyclingPath?lat1={lat1}&long1={long1}&lat2={lat2}&long2={long2}")]
        Stream getCyclingPath(string lat1, string long1, string lat2, string long2);
    }
}
