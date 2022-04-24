using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Proxy
{
    internal class JCDecauxItem
    {

        static readonly HttpClient client = new HttpClient();
        string api_key = "6f6bf0904d38bdb4a4a7a13fed947c982798b696";
       

        public JCDecauxItem async ()
        {
            HttpResponseMessage response = await client.GetAsync($"https://api.jcdecaux.com/vls/v3/contracts?apiKey={api_key}");


        }
    }
}
