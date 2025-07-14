using backend.models;
using backend.services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;

namespace backend.data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IConfiguration configuration)
        {
            var connectionString = configuration["MongoDB:ConnectionString"];
            var databaseName = configuration["MongoDB:DatabaseName"];

            if (string.IsNullOrEmpty(connectionString))
                throw new ArgumentNullException("MongoDB:ConnectionString is missing");

            if (string.IsNullOrEmpty(databaseName))
                throw new ArgumentNullException("MongoDB:DatabaseName is missing");

            var client = new MongoClient(connectionString);
            _database = client.GetDatabase(databaseName);
        }


        public IMongoCollection<User> Users => _database.GetCollection<User>("Users");
        public IMongoCollection<DefaultCard> DefaultCards => _database.GetCollection<DefaultCard>("DefaultCards");
        public IMongoCollection<CustomCard> CustomCards => _database.GetCollection<CustomCard>("CustomCards");

        public async Task InsertSampleDataAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var defaultCardService = scope.ServiceProvider.GetRequiredService<IDefaultCardService>();

            var sampleData = new List<DefaultCard>
            {

                // new DefaultCard
                // {
                //     //1
                //     Name = "мајка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/мајка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/мајка.png",
                //     Category = "People"
                // },new DefaultCard
                // {
                //     //2
                //     Name = "татко",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/татко.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/татко.m4a",
                //     Category = "People"
                // },

                // new DefaultCard
                // {
                //     //3
                //     Name = "семејство",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/семејство.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/семејство.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //4
                //     Name = "баба",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/баба.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/баба.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //5
                //     Name = "дедо",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/дедо.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/дедо.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //6
                //     Name = "сестра",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/сестра.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/сестра.png",
                //     Category = "People"
                // },

                // new DefaultCard
                // {
                //     //7
                //     Name = "брат",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/брат.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/брат.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //8
                //     Name = "тетка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/тетка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/тетка.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //9
                //     Name = "чичко",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/чичко.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/чичко.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //10
                //     Name = "братучеди",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/братучеди.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/братучеди.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //11
                //     Name = "другар",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/другар.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/другар.png",
                //     Category = "People"
                // },
                // new DefaultCard
                // {
                //     //12
                //     Name = "бебе",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/бебе.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/бебе.png",
                //     Category = "People"
                // },
                //  new DefaultCard
                // {
                //     //13
                //     Name = "симпатија",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/симпатија.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/симпатија.png",
                //     Category = "People"
                // },
                //  new DefaultCard
                // {
                //     //14
                //     Name = "учителка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/учителка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/учителка.png",
                //     Category = "People"
                // },

                // new DefaultCard
                // {
                //     //15
                //     Name = "учител",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/учител.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/учител.png",
                //     Category = "People"
                // },

                //  new DefaultCard
                // {
                //     //16
                //     Name = "доктор",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/доктор.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/доктор.png",
                //     Category = "People"
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "логопед",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/people/логопед.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/people/логопед.png",
                //     Category = "People"
                // },


            };
            foreach (var dfCard in sampleData)
            {
                await defaultCardService.AddDefaultCardAsync(dfCard);
            }

            // DefaultCards.InsertMany(sampleData);
        }
    }
}