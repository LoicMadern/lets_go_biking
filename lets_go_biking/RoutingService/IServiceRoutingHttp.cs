using System;
using System.Collections.Generic;
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
        string getClosestStation(float x, float y);


        [OperationContract]
        [WebInvoke(Method = "GET",
        ResponseFormat = WebMessageFormat.Json,
        BodyStyle = WebMessageBodyStyle.Wrapped,
        RequestFormat = WebMessageFormat.Json,
        UriTemplate = "GetWalking")]
        string GetRouteWalking();

        [OperationContract]
        [WebInvoke(Method = "GET",
         ResponseFormat = WebMessageFormat.Json,
         BodyStyle = WebMessageBodyStyle.Wrapped,
         UriTemplate = "getPath?lat1={lat1}&long1={long1}&lat2={lat2}&long2={long2}")]
        string getPath(string lat1, string long1, string lat2, string long2);








    }
}
