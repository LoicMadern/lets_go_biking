using Newtonsoft.Json;
using Proxy;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Web;

namespace RoutingService
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "Service1" à la fois dans le code et le fichier de configuration.
    public class ServiceRoutingSoap : IServiceRoutingSoap
    {

        List<Station> stations = new Stations().content;

        public float[] getClosestStation(float latitude, float longitude)
        {
            float currentMinDistance = -1;
            Station currentMinDistanceStation = null;
            Debug.WriteLine("Inputs : " + latitude + ' ' + longitude);


            foreach (Station element in stations)
            { 
                var distance = CaclulatorCoordinates.getDistanceFrom2GpsCoordinates(latitude, longitude, (float)element.position.latitude, (float)element.position.longitude);
                Debug.WriteLine(element.name + " - " + element.position.latitude + ' ' + element.position.longitude);
                if (currentMinDistance == -1 || currentMinDistance > distance)
                {
                    currentMinDistance = distance;
                    currentMinDistanceStation = element;

                }
            }

            string output = JsonConvert.SerializeObject(currentMinDistanceStation.position);
            Debug.WriteLine("result closest station " + currentMinDistanceStation.name + " " + output);
            float[] array = new float[] { (float)currentMinDistanceStation.position.latitude, (float)currentMinDistanceStation.position.longitude };
            return array;


        }




        public Stream getWalkingPath(string lat1, string long1, string lat2, string long2)
        {
            //http://localhost:8736/Design_Time_Addresses/Proxy/Service1/getPath?lat1=8.681495&long1=49.41461&lat2=8.687872&long2=49.420318

            HttpClient client = new HttpClient();
            string url = "https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf62483c7e6c9cdcd642968bb2481efbf9316c&start=" + lat1 + "," + long1 + "&end=" + lat2 + "," + long2;
            Debug.WriteLine(url);
            var response = client.GetAsync(url).Result;
            response.EnsureSuccessStatusCode();
            var content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");
            Debug.WriteLine(content);
            byte[] byteArray = Encoding.UTF8.GetBytes(content);
            //byte[] byteArray = Encoding.ASCII.GetBytes(contents);
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
            //byte[] byteArray = Encoding.ASCII.GetBytes(contents);
            MemoryStream stream = new MemoryStream(byteArray);
            return stream;
        }

    }
}
