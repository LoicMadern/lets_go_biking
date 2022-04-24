
using Newtonsoft.Json;
using Proxy;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace RoutingService
{
    public class ServiceRoutingHttp : IServiceRoutingHttp
    {
        List<UtilitiesStation> stations = new Stations().content;

        public string getClosestStation(float latitude, float longitude)
        {
            float currentMinDistance = -1;
            UtilitiesStation currentMinDistanceStation = null;
            Debug.WriteLine("Inputs : " + latitude + ' ' + longitude);


            foreach (UtilitiesStation element in stations)
            {
          


                var distance = CaclulatorCoordinates.getDistanceFrom2GpsCoordinates(latitude, longitude, (float) element.position.latitude, (float) element.position.longitude);
                Debug.WriteLine(element.name + " - " + element.position.latitude + ' ' + element.position.longitude);
                if (currentMinDistance == -1 || currentMinDistance > distance)
                {
                    currentMinDistance = distance;
                    currentMinDistanceStation = element;
                   
                }


            }

            string output = JsonConvert.SerializeObject(currentMinDistanceStation.position);
            Debug.WriteLine("result closest station " + currentMinDistanceStation.name + " " + output);
            output = output.Replace("\r\n", "\n");
            return output;

           
        }
        public string GetRouteWalking()
        {
         

            var httpClient = new HttpClient { };
         

      


            string url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62483c7e6c9cdcd642968bb2481efbf9316c&";

            // quotes might have to be escaped
            var values = 
            new Dictionary<object, string>
            {
                
                ["start"] = $"{49.41461},{8.681495}",
                ["end"] = $"{49.41943},{8.686507}"
              
            };

            var query = HttpUtility.ParseQueryString("");
            foreach (var entry in values)
            {
                query.Add((string) entry.Key, entry.Value);
            }
            

            url += query.ToString();
            Debug.WriteLine(url);

            var response = httpClient.GetAsync(url).Result;

            response.EnsureSuccessStatusCode();
            var content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");
            return content;
           



        }

        public string getPath(string lat1, string long1, string lat2, string long2)
        {
            //http://localhost:8736/Design_Time_Addresses/Proxy/Service1/getPath?lat1=8.681495&long1=49.41461&lat2=8.687872&long2=49.420318

            HttpClient client = new HttpClient();
            string url = "https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62483c7e6c9cdcd642968bb2481efbf9316c&start=" + lat1 + "," + long1 + "&end=" + lat2 + "," + long2;
            Debug.WriteLine(url);
            var response = client.GetAsync(url).Result;
            response.EnsureSuccessStatusCode();
            var content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");
            return content;
           
           
        }
    }
}
