using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;


namespace Proxy
{
    internal class ProxyCache<T>
    {

        ObjectCache cache = MemoryCache.Default;
        DateTimeOffset dt_default;
     

        public ProxyCache(){
            dt_default = ObjectCache.InfiniteAbsoluteExpiration;
        }

        public T Get(string CacheItemName)
        {
            dt_default = DateTimeOffset.Now;
            if (cache.Get(CacheItemName) == null)
            {
                Debug.WriteLine("creating object with key" + CacheItemName);
                
                T obj = (T) Activator.CreateInstance(typeof(T), new Object[] {CacheItemName});
                cache.Add(CacheItemName, obj, dt_default);
                return obj;
            }
            return (T) cache.Get(CacheItemName);
        }

        public T Get(string CacheItemName, double dt_seconds)
        {
            if (cache.Get(CacheItemName) == null)
            {

                T obj = (T)Activator.CreateInstance(typeof(T), new object[] { CacheItemName });
                cache.Add(CacheItemName, obj, DateTimeOffset.Now.AddSeconds(dt_seconds));
                return obj;
            }

            return (T)cache.Get(CacheItemName);
        }

        public T Get(string CacheItemName, DateTimeOffset dt)
        {
            if (cache.Get(CacheItemName) == null)
            {
                T obj = (T)Activator.CreateInstance(typeof(T), new object[] { CacheItemName });
                cache.Add(CacheItemName, obj, dt);
                return obj;
            }

            return (T)cache.Get(CacheItemName);

        }



    }
}
