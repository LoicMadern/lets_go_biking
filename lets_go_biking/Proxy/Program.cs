using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace Proxy
{
    public class Program
    {
        public static void Main(string[] args)
        {
            ServiceHost svc = new ServiceHost(typeof(Proxy.ServiceProxyHttp));
            svc.Open();
            Console.ReadLine();
        }
    }
}
