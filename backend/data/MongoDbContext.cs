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

        public MongoDbContext(IConfiguration configuration) // configuration inn appsettings.json
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
                //     Name = "нула",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/communication/нуула.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/communication/0.png",
                //     Category = "Numbers",
                //     Position = 1
                // },
                // new DefaultCard
                // {
                //     //2
                //     Name = "еден",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/communication/еден.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/communication/1.png",
                //     Category = "Numbers",
                //     Position = 13
                // },

                // new DefaultCard
                // {
                //     //3
                //     Name = "два",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/два.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/2.png",
                //     Category = "Numbers",
                //     Position = 3
                // },
                // new DefaultCard
                // {
                //     //4
                //     Name = "три",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/три.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/3.png",
                //     Category = "Numbers",
                //     Position = 4
                // },
                // new DefaultCard
                // {
                //     //5
                //     Name = "четири",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/четири.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/4.png",
                //     Category = "Numbers",
                //     Position = 5
                // },
                // new DefaultCard
                // {
                //     //6
                //     Name = "пет",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/пет.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/5.png",
                //     Category = "Numbers",
                //     Position = 6
                // },

                // new DefaultCard
                // {
                //     //7
                //     Name = "шест",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/шест.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/6.png",
                //     Category = "Numbers",
                //     Position = 7
                // },
                // new DefaultCard
                // {
                //     //8
                //     Name = "седум",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/седум.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/7.png",
                //     Category = "Numbers",
                //     Position = 8
                // },
                // new DefaultCard
                // {
                //     //9
                //     Name = "осум",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/осум.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/8.png",
                //     Category = "Numbers",
                //     Position = 9
                // },
                // new DefaultCard
                // {
                //     //10
                //     Name = "девет",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/девет.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/9.png",
                //     Category = "Numbers",
                //     Position = 10
                // },
                // new DefaultCard
                // {
                //     //11
                //     Name = "цртање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/цртање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/цртање.png",
                //     Category = "Activities",
                //     Position = 11
                // },
                // new DefaultCard
                // {
                //     //12
                //     Name = "читање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/читање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/читање.png",
                //     Category = "Activities",
                //     Position = 12
                // },
                //  new DefaultCard
                // {
                //     //13
                //     Name = "пишување",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/пишување.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/пишување.png",
                //     Category = "Activities",
                //     Position = 13
                // },
                //  new DefaultCard
                // {
                //     //14
                //     Name = "учење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/учење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/учење.png",
                //     Category = "Activities",
                //     Position = 14
                // },

                // new DefaultCard
                // {
                //     //15
                //     Name = "лаптоп",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/лаптоп.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/лаптоп.png",
                //     Category = "Activities",
                //     Position = 15
                // },

                //  new DefaultCard
                // {
                //     //16
                //      Name = "телевизија",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/телевизија.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/тв.png",
                //     Category = "Activities",
                //     Position = 16
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "видео игри",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/видео игри.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/видео игри.png",
                //     Category = "Activities",
                //     Position = 17
                // },

                // new DefaultCard
                // {
                //     //1
                //     Name = "сложувалка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/сложувалка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/сложувалка.png",
                //     Category = "Activities",
                //     Position = 18
                // },

                // new DefaultCard
                // {
                //     //2
                //     Name = "коцки",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/коцки.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/коцки.png",
                //     Category = "Activities",
                //     Position = 19
                // },

                // new DefaultCard
                // {
                // //     //3
                //     Name = "пластелин",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/пластелин.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/пластелин.png",
                //     Category = "Activities",
                //     Position = 20
                // },
                // new DefaultCard
                // {
                //     //4
                //     Name = "танцување",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/танцување.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/танцување.png",
                //     Category = "Activities",
                //     Position = 21
                // },
                // new DefaultCard
                // {
                //     //5
                //     Name = "музика",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/музика.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/музика.png",
                //     Category = "Activities",
                //     Position = 22
                // },
                // new DefaultCard
                // {
                //     //6
                //     Name = "шах",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/шах.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/шах.png",
                //     Category = "Activities",
                //     Position = 23
                // },

                // new DefaultCard
                // {
                //     //7
                //     Name = "вежбање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/вежбање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/вежбање.png",
                //     Category = "Activities",
                //     Position = 24
                // },
                // new DefaultCard
                // {
                //     //8
                //     Name = "готвење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/готвење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/готвење.png",
                //     Category = "Activities",
                //     Position = 25
                // },
                // new DefaultCard
                // {
                //     //9
                //     Name = "бањање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/бањање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/бањање.png",
                //     Category = "Activities",
                //     Position = 26
                // },
                // new DefaultCard
                // {
                //     //10
                //     Name = "миење лице",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/миење лице.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/миење лице.png",
                //     Category = "Activities",
                //     Position = 27
                // },
                // new DefaultCard
                // {
                //     //11
                //     Name = "миење заби",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/миење заби.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/миење заби.png",
                //     Category = "Activities",
                //     Position = 28
                // },
                // new DefaultCard
                // {
                //     //12
                //     Name = "облекување",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/облекување.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/облекување.png",
                //     Category = "Activities",
                //     Position = 29
                // },
                //  new DefaultCard
                // {
                //     //13
                //     Name = "чистење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/чистење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/чистење.png",
                //     Category = "Activities",
                //     Position = 30
                // },
                //  new DefaultCard
                // {
                //     //14
                //     Name = "игралиште",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/игралиште.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/игралиште.png",
                //     Category = "Activities",
                //     Position = 31
                // },

                // new DefaultCard
                // {
                //     //15
                //     Name = "нож",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/нож.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/нож.png",
                //     Category = "Activities",
                //     Position = 32
                // },

                //  new DefaultCard
                // {
                //     //16
                //     Name = "салфетка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/салфетка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/салфетка.png",
                //     Category = "Activities",
                //     Position = 33
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "сол",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/сол.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/сол.png",
                //     Category = "Activities",
                //     Position = 34
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "бибер",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/бибер.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/бибер.png",
                //     Category = "Activities",
                //     Position = 35
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "мајонез",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/мајонез.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/мајонез.png",
                //     Category = "Activities",
                //     Position = 36
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "кечап",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/кечап.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/кечап.png",
                //     Category = "Activities",
                //     Position = 37
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "сенф",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/сенф.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/сенф.png",
                //     Category = "Activities",
                //     Position = 38
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "жаба",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/activities/жаба.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/activities/жаба.png",
                //     Category = "Activities"
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