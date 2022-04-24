using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Proxy

{
    


    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom de classe "Service1" à la fois dans le code et le fichier de configuration.
    public class Proxy : IProxy
    {
        ProxyCache<JCDecauxItem> cache = new ProxyCache<JCDecauxItem>();
        

        public string GetAllStations()
        {
            HttpClient client = new HttpClient();
            var response = client.GetAsync("https://api.jcdecaux.com/vls/v3/stations?contract=nancy&apiKey=6f6bf0904d38bdb4a4a7a13fed947c982798b696").Result;
            response.EnsureSuccessStatusCode();
            var content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");
            return content;
        }

        public string GetSpecificStation(string station_number)
        {
            Debug.WriteLine("trying to get the station number :" + station_number );
            return (string) ((JCDecauxItem) cache.Get(station_number)).content;
        }



    }
}
