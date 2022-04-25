using System.Diagnostics;

public class Client
{


    public static async Task Main()
    {

        var client = new ServiceReference1.ServiceRoutingSoapClient(ServiceReference1.ServiceRoutingSoapClient.EndpointConfiguration.BasicHttpBinding_IServiceRoutingSoap);
        Stopwatch stopwatch = new Stopwatch();
        stopwatch.Start();
        int i = 0;
        int max_requestes = 10;

        for (; i < max_requestes; i++)
        {
            await client.ChannelFactory.CreateChannel().getClosestStationAsync(41, 6);
            
        }
        stopwatch.Stop();

        Console.WriteLine("Average Time for  " + i + " closest station requests : {0} ms", stopwatch.ElapsedMilliseconds/max_requestes);



    }
}