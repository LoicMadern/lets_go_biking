
using Newtonsoft.Json;
using Proxy;

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
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
        List<Station> stations = new Stations().content;
        ServiceProxyHttp proxy = new ServiceProxyHttp();
        

        public float[] getClosestStation(float latitude, float longitude, bool isArrival)
        {

            int nb_bikes_available = 0;
            int nb_bikes_stands = 0;
            float currentMinDistance = -1;
            Station currentMinDistanceStation = null;
            

            foreach (Station element in stations)
            {

                var distance = CaclulatorCoordinates.getDistanceFrom2GpsCoordinates(latitude, longitude, (float)element.position.latitude, (float)element.position.longitude);
          
                if (currentMinDistance == -1 || currentMinDistance > distance )
                {
                    
                    string station_name = element.name;
                    string num_station = station_name.Substring(3, 2);
                    string key = "";

                    if (num_station[0] == '0')
                    {
                        Debug.WriteLine("other");
                        key = num_station[1].ToString();
                    }
                    else { key = num_station; }

                    Station station = JsonConvert.DeserializeObject<Station>(proxy.GetSpecificStation(key));
                    nb_bikes_available = station.totalStands.availabilities.bikes;
                    nb_bikes_stands = station.totalStands.availabilities.stands;

                    if (!isArrival )
                    {
                        if(nb_bikes_available > 0)
                        {
                            currentMinDistance = distance;
                            currentMinDistanceStation = element;
                        }
                                
                    }else
                    {
                        if (nb_bikes_available > 0)
                        {
                            currentMinDistance = distance;
                            currentMinDistanceStation = element;

                        }

                    }

                }

            }
        

            string output = JsonConvert.SerializeObject(currentMinDistanceStation.position);
            Debug.WriteLine("result closest station " + currentMinDistanceStation.name + " " + output);
            float[] array = new float[] {(float) currentMinDistanceStation.position.latitude, (float) currentMinDistanceStation.position.longitude };
            Debug.WriteLine("closest station : " + array);
            return array;
        }

       


        public Stream getWalkingPath(string lat1, string long1, string lat2, string long2)
        {
            HttpClient client = new HttpClient();
            string url = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483c7e6c9cdcd642968bb2481efbf9316c&start=" + lat1 + "," + long1 + "&end=" + lat2 + "," + long2;
            Debug.WriteLine(url);
            var response = client.GetAsync(url).Result;
            response.EnsureSuccessStatusCode();
            var content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");
            byte[] byteArray = Encoding.UTF8.GetBytes(content);
            MemoryStream stream = new MemoryStream(byteArray);
            return stream;
        }


        public Stream getCyclingPath(string lat1, string long1, string lat2, string long2)
        {
            HttpClient client = new HttpClient();
            string url = "https://api.openrouteservice.org/v2/directions/cycling-regular?api_key=5b3ce3597851110001cf62483c7e6c9cdcd642968bb2481efbf9316c&start=" + lat1 + "," + long1 + "&end=" + lat2 + "," + long2;
            Debug.WriteLine(url);
            var response = client.GetAsync(url).Result;
            response.EnsureSuccessStatusCode();
            var content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");
            Debug.WriteLine(content);
            byte[] byteArray = Encoding.UTF8.GetBytes(content);
            MemoryStream stream = new MemoryStream(byteArray);
            return stream;
        }
    }
}
