using Newtonsoft.Json;
using Proxy;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace RoutingService
{
    
    
 
    public class Position
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }

    public class Station
    {
        public int number { get; set; }
        public string contract_name { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public Position position { get; set; }
        public bool banking { get; set; }
        public bool bonus { get; set; }
        public string status { get; set; }

        public StationInfo totalStands { get; set; }
    }

    public class StationInfo
    {
        public StandAvailability availabilities { get; set; }
        public int capacity { get; set; }
    }

    public class StandAvailability
    {
        public int bikes { get; set; }
        public int stands { get; set; }
    }


    public class CaclulatorCoordinates{

        public static float deg2rad(float deg)
        {
            return (float)(deg * (Math.PI / 180));
        }
        public static float  getDistanceFrom2GpsCoordinates(float lat1, float lon1, float lat2, float lon2)
        {
            // Radius of the earth in km
            var earthRadius = 6371;
            float dLat = deg2rad(lat2 - lat1);
            float dLon = deg2rad(lon2 - lon1);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(deg2rad(lat1)) * Math.Cos(deg2rad(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2)
            ;
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = earthRadius * c; // Distance in km
            return (float) d;
        }
    }

    public class Stations 
    {

        public List<Station> content; 
        public Stations()
        {
            ServiceProxyHttp serviceProxyHttp = new ServiceProxyHttp();
            string result = serviceProxyHttp.GetAllStations();

            content = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Station>>(result);

            foreach (Station element in content)
            {
                Debug.WriteLine($"{element.name} - {element.position.latitude}- {element.position.longitude}");
            }
            
        }
       
    }

}
  



