using System.ServiceModel;
using RoutingService;


namespace HostRoutingService
{
    public class Program
    {

        public static void Main(string[] args)
        {
            ServiceHost svc = new ServiceHost(typeof(ServiceRoutingHttp));
            svc.Open();
            ServiceHost svc2 = new ServiceHost(typeof(RouServiceRoutingHttp));
            svc2.Open();
            Console.ReadLine();
        }
    }


}
