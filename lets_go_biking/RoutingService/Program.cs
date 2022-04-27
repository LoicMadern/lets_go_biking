using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;

namespace RoutingService
{
    public class Program
    {

        public static void Main(string[] args)
        {
            ServiceHost svc = new ServiceHost(typeof(RoutingService.ServiceRoutingSoap));
            svc.Open();
            ServiceHost svc2 = new ServiceHost(typeof(RoutingService.ServiceRoutingHttp));
            svc2.Open();
            Console.ReadLine();
        }
    }
}
