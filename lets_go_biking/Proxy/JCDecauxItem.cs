using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Proxy
{
    public class JCDecauxItem
    {

        HttpClient client = new HttpClient();
        public string content = "";

        

        public JCDecauxItem(string key)
        {
          
            //var id = key.Substring(4, key.Length - 5);
            var response = client.GetAsync("https://api.jcdecaux.com/vls/v3/stations/?{id}&contract=nancy&apiKey=6f6bf0904d38bdb4a4a7a13fed947c982798b696").Result;
            //var response = client.GetAsync("https://api.jcdecaux.com/vls/v3/contracts?apiKey=6f6bf0904d38bdb4a4a7a13fed947c982798b696").Result;
            response.EnsureSuccessStatusCode();
            content = response.Content.ReadAsStringAsync().Result;
            content = content.Replace("\r\n", "\n");    
        }

  


    }
}
