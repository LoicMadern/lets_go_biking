using System.Diagnostics;

public class Client
{
    public static async Task Main()
    {

        string commmand = "";
        int i = 0;
        int max_requestes = 10;
        Stopwatch stopwatch = new Stopwatch();
        var client = new ServiceReference1.ServiceRoutingSoapClient(ServiceReference1.ServiceRoutingSoapClient.EndpointConfiguration.BasicHttpBinding_IServiceRoutingSoap);
        while (true)
        {

            Console.WriteLine("Press 1 : test requête closest station");
            Console.WriteLine("Press 2 : test requête cycling path");
            Console.WriteLine("Press 3 : test requête walking path");
            commmand = Console.ReadLine(); 

            if(commmand == "1")
            {
                Console.WriteLine("Debut test requête closest station:");
          
                stopwatch.Start();
              
                for (; i < max_requestes; i++)
                {
                    await client.getClosestStationAsync(6, 40, false);
                }
                stopwatch.Stop();
                Console.WriteLine("Average Time for " + i + " closest station requests : {0} ms \n", stopwatch.ElapsedMilliseconds / max_requestes);

            }else if(commmand == "2")
            {
                Console.WriteLine("Debut test requête cycling path: ");
                stopwatch.Reset();
                stopwatch.Start();
                i = 0;
                max_requestes = 10;
                for (; i < max_requestes; i++)
                {
                    await client.getCyclingPathAsync("6.193786", "48.689547", "6.164643", "48.688682");
                }
                stopwatch.Stop();
                Console.WriteLine("Average Time for " + i + " getCycling requests : {0} ms \n", stopwatch.ElapsedMilliseconds / max_requestes);
            }else if (commmand == "3")
            {

                Console.WriteLine("Debut test requête walking path: ");
                stopwatch.Reset();
                stopwatch.Start();
                i = 0;
                max_requestes = 10;
                for (; i < max_requestes; i++)
                {
                    await client.getWalkingPathAsync("6.193786", "48.689547", "6.164643", "48.688682");
                }
                stopwatch.Stop();
                Console.WriteLine("Average Time for " + i + " get walking : {0} ms \n", stopwatch.ElapsedMilliseconds / max_requestes);
            }
            commmand = "";
        }
       

        



    }
}