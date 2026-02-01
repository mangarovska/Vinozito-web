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
                //     Name = "Сакам",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/communication/сакам.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/communication/сакам.png",
                //     Category = "Communication",
                //     Position = -1
                // },
                // new DefaultCard
                // {
                //     //2
                //     Name = "не сакам",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/communication/не сакам.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/communication/не сакам.png",
                //     Category = "Communication",
                //     Position = 0
                // },

                // new DefaultCard
                // {
                //     //3
                //     Name = "миење лице",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/миење лице.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/миење лице.png",
                //     Category = "Routines",
                //     Position = 3
                // },
                // new DefaultCard
                // {
                //     //4
                //     Name = "миење заби",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/миење заби.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/миење заби.png",
                //     Category = "Routines",
                //     Position = 4
                // },
                // new DefaultCard
                // {
                //     //5
                //     Name = "миење раце",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/миење раце.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/миење раце.png",
                //     Category = "Routines",
                //     Position = 5
                // },
                // new DefaultCard
                // {
                //     //6
                //     Name = "чешлање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/чешлање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/чешлање.png",
                //     Category = "Routines",
                //     Position = 6
                // },

                // new DefaultCard
                // {
                //     //7
                //     Name = "облекување",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/облекување.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/облекување.png",
                //     Category = "Routines",
                //     Position = 7
                // },
                // new DefaultCard
                // {
                //     //8
                //     Name = "чистење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/чистење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/чистење.png",
                //     Category = "Routines",
                //     Position = 8
                // },
                // new DefaultCard
                // {
                //     //9
                //     Name = "спиење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/спиење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/спиење.png",
                //     Category = "Routines",
                //     Position = 9
                // },
                // new DefaultCard
                // {
                //     //10
                //     Name = "девет",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/девет.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/девет.png",
                //     Category = "Routines",
                //     Position = 10
                // },
                // new DefaultCard
                // {
                //     //11
                //     Name = "рамо",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/рамо.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/рамо.png",
                //     Category = "Routines",
                //     Position = 11
                // },
                // new DefaultCard
                // {
                //     //12
                //     Name = "рака",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/рака.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/рака.png",
                //     Category = "Routines",
                //     Position = 12
                // },
                //  new DefaultCard
                // {
                //     //13
                //     Name = "лакт",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/лакт.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/лакт.png",
                //     Category = "Routines",
                //     Position = 13
                // },
                //  new DefaultCard
                // {
                //     //14
                //     Name = "дланка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/дланка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/дланка.png",
                //     Category = "Routines",
                //     Position = 14
                // },

                // new DefaultCard
                // {
                //     //15
                //     Name = "прст",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/прст.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/прст.png",
                //     Category = "Routines",
                //     Position = 15
                // },

                //  new DefaultCard
                // {
                //     //16
                //      Name = "нокт",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/нокт.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/нокт.png",
                //     Category = "Routines",
                //     Position = 16
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "стомак",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/стомак.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/стомак.png",
                //     Category = "Routines",
                //     Position = 17
                // },

                // new DefaultCard
                // {
                //     //1
                //     Name = "грб",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/грб.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/грб.png",
                //     Category = "Routines",
                //     Position = 18
                // },

                // new DefaultCard
                // {
                //     //2
                //     Name = "задник",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/задник.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/задник.png",
                //     Category = "Routines",
                //     Position = 19
                // },

                // new DefaultCard
                // {
                // //     //3
                //     Name = "нога",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/нога.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/нога.png",
                //     Category = "Routines",
                //     Position = 20
                // },
                // new DefaultCard
                // {
                //     //4
                //     Name = "колено",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/колено.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/колено.png",
                //     Category = "Routines",
                //     Position = 21
                // },
                // new DefaultCard
                // {
                //     //5
                //     Name = "стапало",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/стапало.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/стапало.png",
                //     Category = "Routines",
                //     Position = 22
                // },
                // new DefaultCard
                // {
                //     //6
                //     Name = "шах",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/шах.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/шах.png",
                //     Category = "Routines",
                //     Position = 23
                // },

                // new DefaultCard
                // {
                //     //7
                //     Name = "вежбање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/вежбање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/вежбање.png",
                //     Category = "Routines",
                //     Position = 24
                // },
                // new DefaultCard
                // {
                //     //8
                //     Name = "готвење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/готвење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/готвење.png",
                //     Category = "Routines",
                //     Position = 25
                // },
                // new DefaultCard
                // {
                //     //9
                //     Name = "бањање",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/бањање.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/бањање.png",
                //     Category = "Routines",
                //     Position = 26
                // },
                // new DefaultCard
                // {
                //     //10
                //     Name = "миење лице",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/миење лице.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/миење лице.png",
                //     Category = "Routines",
                //     Position = 27
                // },
                // new DefaultCard
                // {
                //     //11
                //     Name = "миење заби",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/миење заби.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/миење заби.png",
                //     Category = "Routines",
                //     Position = 28
                // },
                // new DefaultCard
                // {
                //     //12
                //     Name = "облекување",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/облекување.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/облекување.png",
                //     Category = "Routines",
                //     Position = 29
                // },
                //  new DefaultCard
                // {
                //     //13
                //     Name = "чистење",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/чистење.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/чистење.png",
                //     Category = "Routines",
                //     Position = 30
                // },
                //  new DefaultCard
                // {
                //     //14
                //     Name = "игралиште",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/игралиште.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/игралиште.png",
                //     Category = "Routines",
                //     Position = 31
                // },

                // new DefaultCard
                // {
                //     //15
                //     Name = "нож",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/нож.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/нож.png",
                //     Category = "Routines",
                //     Position = 32
                // },

                //  new DefaultCard
                // {
                //     //16
                //     Name = "салфетка",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/салфетка.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/салфетка.png",
                //     Category = "Routines",
                //     Position = 33
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "сол",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/сол.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/сол.png",
                //     Category = "Routines",
                //     Position = 34
                // },

                //  new DefaultCard
                // {
                //     //17
                //     Name = "бибер",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/бибер.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/бибер.png",
                //     Category = "Routines",
                //     Position = 35
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "мајонез",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/мајонез.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/мајонез.png",
                //     Category = "Routines",
                //     Position = 36
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "кечап",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/кечап.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/кечап.png",
                //     Category = "Routines",
                //     Position = 37
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "сенф",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/сенф.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/сенф.png",
                //     Category = "Routines",
                //     Position = 38
                // },
                //  new DefaultCard
                // {
                //     //17
                //     Name = "жаба",
                //     AudioVoice = "http://mangaserver.ddnsfree.com:5001/uploads/audio/routines/жаба.m4a",
                //     Image = "http://mangaserver.ddnsfree.com:5001/uploads/images/routines/жаба.png",
                //     Category = "Routines"
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