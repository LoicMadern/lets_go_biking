using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;

namespace RoutingService
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom d'interface "IService1" à la fois dans le code et le fichier de configuration.
    [ServiceContract]
    public interface IServiceRoutingSoap
    {
        [OperationContract]
        float[] getClosestStation(float x, float y);

        [OperationContract]
        Stream getWalkingPath(string lat1, string long1, string lat2, string long2);

        [OperationContract]
        Stream getCyclingPath(string lat1, string long1, string lat2, string long2);
    }
}
