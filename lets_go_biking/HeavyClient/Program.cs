public class Client
{



    static readonly HttpClient client = new HttpClient();

    public static async Task Main()
    {

        var client = new ServiceReference1.CalculatorSoapClient(ServiceReference1.CalculatorSoapClient.EndpointConfiguration.CalculatorSoap);
        Console.WriteLine(await client.ChannelFactory.CreateChannel().AddAsync(3, 2));

        var client2 = new ServiceReference2.MathsOperationsClient(ServiceReference2.MathsOperationsClient.EndpointConfiguration.BasicHttpBinding_IMathsOperations);
        //Console.WriteLine(await client2.AddAsync(2,6));


    }
}