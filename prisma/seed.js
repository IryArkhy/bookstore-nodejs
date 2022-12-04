var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const genresList = [
    'drama',
    'fable',
    'fairy tail',
    'fantasy',
    'fiction',
    'fiction in verse',
    'folklore',
    'historical fiction',
    'horror',
    'humor',
    'legend',
    'mystery',
    'mythology',
    'poetry',
    'realistic fiction',
    'science fiction',
    'tall tale',
    'biography',
    'realism',
    'magical realism',
    'thriller',
    'nonfiction',
    'detective',
    'manga',
    'romance',
    'children',
    'tragedy',
];
let authors;
let genres = {};
function createAuthors() {
    return __awaiter(this, void 0, void 0, function* () {
        const shakespeare = yield prisma.author.create({
            data: {
                name: 'William',
                surname: 'Shakespeare',
            },
        });
        const christie = yield prisma.author.create({
            data: {
                name: 'Agatha',
                surname: 'Christie',
            },
        });
        const cartland = yield prisma.author.create({
            data: {
                name: 'Barbara',
                surname: 'Cartland',
            },
        });
        const steel = yield prisma.author.create({
            data: {
                name: 'Danielle',
                surname: 'Steel',
            },
        });
        const robbins = yield prisma.author.create({
            data: {
                name: 'Harold',
                surname: 'Robbins',
            },
        });
        const simenon = yield prisma.author.create({
            data: {
                name: 'Georges',
                surname: 'Simenon',
            },
        });
        const blyton = yield prisma.author.create({
            data: {
                name: 'Enid',
                surname: 'Blyton',
            },
        });
        const sheldon = yield prisma.author.create({
            data: {
                name: 'Sidney',
                surname: 'Sheldon',
            },
        });
        const oda = yield prisma.author.create({
            data: {
                name: 'Eiichiro',
                surname: 'Oda',
            },
        });
        const rowling = yield prisma.author.create({
            data: {
                name: 'Joanne',
                surname: 'Rowling',
            },
        });
        const king = yield prisma.author.create({
            data: {
                name: 'Stephen',
                surname: 'King',
            },
        });
        authors = {
            shakespeare,
            christie,
            cartland,
            steel,
            robbins,
            simenon,
            blyton,
            sheldon,
            oda,
            rowling,
            king,
        };
    });
}
function createGenres() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < genresList.length; i++) {
            const genre = genresList[i];
            const res = yield prisma.genre.create({
                data: {
                    name: genre,
                },
            });
            genres[genre] = res;
        }
    });
}
function createBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.book.create({
            data: {
                title: 'Antony and Cleopatra',
                authorID: authors.shakespeare.id,
                description: "In a setting soon after Julius Caesar, Marc Antony is in love with Cleopatra, an Egyptian queen. What used to be a friendship between Emperor Octavius and Antony develops into a hatred as Antony rejects the Emperor's sister, his wife, in favour of Cleopatra. Antony attempts to take the throne from Octavius and fails, while Cleopatra commits suicide.",
                year: 1608,
                price: 20,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.tragedy.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Hamlet',
                authorID: authors.shakespeare.id,
                description: "Prince Hamlet is visited by his father's ghost and ordered to avenge his father's murder by killing King Claudius, his uncle. After struggling with several questions, including whether what the ghost said is true and whether it is right for him to take revenge, Hamlet, along with almost all the other major characters, is killed.",
                year: 1605,
                price: 25,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.tragedy.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Othello',
                authorID: authors.shakespeare.id,
                description: "Othello, a Moor and military general living in Venice, elopes with Desdemona, the daughter of a senator. Later, on Cyprus, he is persuaded by his servant Iago that his wife (Desdemona) is having an affair with Michael Cassio, his lieutenant. Iago's story, however, is a lie. Desdemona and Cassio try to convince Othello of their honesty but are rejected. Pursuing a plan suggested by Iago, Othello sends assassins to attack Cassio, who is wounded, while Othello himself smothers Desdomona in her bed. Iago's plot is revealed too late, and Othello commits suicide.",
                year: 1603,
                price: 40,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.tragedy.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'The Mysterious Affair at Styles',
                authorID: authors.christie.id,
                description: "Styles was Christie's first published novel. It introduced Hercule Poirot, Inspector (later, Chief Inspector) Japp, and Arthur Hastings.[3] Poirot, a Belgian refugee of the Great War, is settling in England near the home of Emily Inglethorp, who helped him to his new life. His friend Hastings arrives as a guest at her home. When Mrs Inglethorp is murdered, Poirot uses his detective skills to solve the mystery.",
                year: 1920,
                price: 20,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.detective.id,
                            },
                            {
                                genreID: genres.fiction.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Appointment with Death',
                authorID: authors.christie.id,
                description: 'The adaptation of the book is notable for being one of the most radical reworkings of a novel Christie ever did, not only eliminating Hercule Poirot from the story, but changing the identity of the killer. In the play, the ill Mrs Boynton commits suicide and drops several red herrings that pointed to her family members as possible suspects, hoping that they would suspect each other and therefore continue to live in her shadow even after her death, whereas in the novel Lady Westholme is the murderess. In the play, Lady Westholme becomes a purely comic character.',
                year: 2014,
                price: 20,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.detective.id,
                            },
                            { genreID: genres.fiction.id },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Jig-Saw',
                authorID: authors.cartland.id,
                description: 'A young girl confronts difficulties and temptations which on her first entry into the richest and gayest set of London society. The intoxication of her new freedom and her love of adventure lead her inevitably to exploit her wit and beauty to her own unhappiness, but by good luck and her own native goodness she finds peace and happiness at last.',
                year: 1925,
                price: 34,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.romance.id,
                            },
                            {
                                genreID: genres.fiction.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'A Perfect Stranger',
                authorID: authors.steel.id,
                description: "This book tells the story of Alexander Hale and Raphaella Phillips. Hale, a recently divorced man, takes a walk down his street, when he sees Phillips, a beautiful woman, crying on the steps. We later learn that the woman's name is Raphaella Phillips and that she is married to an eighty-year-old man who is very sick. Hale falls in love with Phillips, who is already married. Raphaella is young, while her husband is old and bedridden. Raphaella does not want to leave her husband but she does not want to stay closed away from the world with nothing to live for either. She has no children and feels like the house doesn't belong to her. In the end Raphaella's husband dies and Raphaella and Alexander can be together.",
                price: 13,
                year: 1983,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.fiction.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Where Love Has Gone',
                authorID: authors.robbins.id,
                description: "Luke Carey has a wife and a baby on the way. His future looks bright until his past catches up with him unexpectedly. A phone call in the dead of night summons him back to San Francisco to help his fourteen-year-old daughter Danielle, whom he hasn't seen in six years. But helping Danielle means he may have to face his ex-wife Nora - a prospect Luke is none too eager to explore.",
                price: 45,
                year: 1962,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.fiction.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: "Monsieur Hire's Engagement",
                authorID: authors.simenon.id,
                description: "Monsieur Hire, a small-time crook of Jewish origin, lives a lonely isolated life without female companionship (apart from his visits to the brothel). Unpopular with his neighbors, he becomes the ideal suspect for the murder of a young prostitute whose corpse is found in a vacant lot near his home. The police place him under 24-hour surveillance and wait for him to do anything suspicious. Once a week, Hire is the unlikely star of a Parisian bowling club, where people think he works for the police. Apart from his passion for bowling, Hire is a peeping Tom and obsessed with the voyeuristic observation of his neighbor Alice. During his nocturnal observations, he is able to identify the perpetrator of the crime who is none other than Alice's boyfriend. Believing that Alice loves him, he does not denounce her boyfriend in order to protect her. At the moment of his arrest, with a lynch mob pursuing him, Hire takes refuge on the roof of a building but falls to his death and dies in the arms of firefighters.",
                year: 1933,
                price: 55,
                genres: {
                    create: {
                        genreID: genres.mystery.id,
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'The Wishing-Chair',
                authorID: authors.blyton.id,
                description: "is a series of two novels by the English author Enid Blyton, and a third book published in 2000 compiled from Blyton's short stories",
                year: 1937,
                price: 33,
                genres: {
                    create: {
                        genreID: genres.children.id,
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'The Naked Face',
                authorID: authors.sheldon.id,
                description: "Dr. Judd Stevens, M.D., is a caring and successful Manhattan psychoanalyst who must face a horrific prospect; someone is trying to kill him. First, John Hanson, a patient trying to overcome his homosexuality, is murdered. Not long after, Carol Roberts, Stevens' secretary, is found tortured to death. Two police officers, Andrew McGreavy and Frank Angeli, are quick to treat Stevens as the prime suspect, partly due to McGreavy's anger over Stevens' testimony in a previous case. Stevens is later run down by a car, and following his recovery, two men in dark try to kill him in his office.",
                year: 1970,
                price: 43,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.thriller.id,
                            },
                            {
                                genreID: genres.detective.id,
                            },
                            {
                                genreID: genres.realism.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Monsters',
                authorID: authors.oda.id,
                description: "is a one-shot manga by Eiichiro Oda, originally published in the 1994 Shonen Jump Autumn Special. It was later reprinted in 1998 as part of Wanted!, a compilation of Oda's pre-One Piece stories.  A voice comic adaptation of Monsters was created as part of the One Piece 100 We Are ONE celebration. It is released in two parts on the Jump Comics Channel on September 6–7, 2021.",
                year: 1994,
                price: 230,
                genres: {
                    create: {
                        genreID: genres.manga.id,
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: "Harry Potter and the Philosopher's Stone",
                authorID: authors.rowling.id,
                description: "Harry Potter lives with his abusive aunt and uncle, Vernon and Petunia Dursley and their bullying son, Dudley. On Harry's eleventh birthday, a half-giant named Rubeus Hagrid personally delivers an acceptance letter to Hogwarts School of Witchcraft and Wizardry, revealing that Harry's parents, James and Lily Potter, were wizards. When Harry was one year old, an evil and powerful dark wizard, Lord Voldemort, murdered his parents. Harry survived Voldemort's killing curse that rebounded off his forehead and seemingly destroyed the Dark Lord, leaving a lightning bolt-shaped scar on his forehead. Unknown to Harry, he is famous in the wizarding world.",
                year: 1997,
                price: 60,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.fiction.id,
                            },
                            {
                                genreID: genres.fantasy.id,
                            },
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.romance.id,
                            },
                            {
                                genreID: genres.thriller.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Harry Potter and the Chamber of Secrets',
                authorID: authors.rowling.id,
                description: "While spending the summer at the Dursleys, twelve-year-old Harry Potter is visited by a house-elf named Dobby. He warns that Harry is in danger and must not return to Hogwarts. Harry refuses, so Dobby magically ruins Aunt Petunia and Uncle Vernon's dinner party. A furious Uncle Vernon locks Harry into his room in retaliation. The Ministry of Magic immediately sends a notice accusing Harry of performing underage magic and threatening dismissal from Hogwarts.",
                year: 1998,
                price: 50,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.fiction.id,
                            },
                            {
                                genreID: genres.fantasy.id,
                            },
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.romance.id,
                            },
                            {
                                genreID: genres.thriller.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Harry Potter and the Prisoner of Azkaban',
                authorID: authors.rowling.id,
                description: 'Thirteen-year-old Harry Potter spends another unhappy summer at the Dursleys. After Aunt Marge insults Harry and his deceased parents, an angry Harry accidentally inflates her. Fearing expulsion from Hogwarts, he runs away. On a dark street, a large black dog watches Harry. Startled, Harry stumbles backward, causing his wand to emit sparks. The Knight Bus, a vehicle that rescues stranded wizards, suddenly arrives. Harry goes to the Leaky Cauldron in Diagon Alley where Cornelius Fudge, the Minister for Magic, is waiting. Harry is not expelled but is asked to remain in Diagon Alley until school starts. While there, Harry reunites with best friends Ron Weasley and Hermione Granger. Mr Weasley warns Harry about the wizard Sirius Black, a convicted murderer who escaped Azkaban prison and is believed to be hunting down Harry.',
                year: 1999,
                price: 20,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.fiction.id,
                            },
                            {
                                genreID: genres.fantasy.id,
                            },
                            {
                                genreID: genres.drama.id,
                            },
                            {
                                genreID: genres.romance.id,
                            },
                            {
                                genreID: genres.thriller.id,
                            },
                        ],
                    },
                },
            },
        });
        yield prisma.book.create({
            data: {
                title: 'Cujo',
                authorID: authors.king.id,
                description: "The story takes place in the setting for many King stories: the fictional town of Castle Rock, Maine. Revolving around two local families, the narrative is interspersed with vignettes from the seemingly mundane lives of various other residents. There are no chapter headings, but breaks between passages indicate when the narration switches to a different perspective. In the summer of 1980, the middle-class Trentons have recently moved to Castle Rock from New York City, bringing with them their four-year-old son, Tad. Vic Trenton discovers his wife, Donna, has recently had an affair with a tennis player named Steve Kemp. In the midst of this household tension, Vic's advertising agency, Ad Worx, is failing due to a scandal over a cereal called Red Razberry Zingers. Vic, and his business partner Roger Breakstone, are forced to travel out of town, leaving Tad and Donna at home alone.",
                year: 1981,
                price: 34,
                genres: {
                    createMany: {
                        data: [
                            {
                                genreID: genres.thriller.id,
                            },
                            {
                                genreID: genres.horror.id,
                            },
                        ],
                    },
                },
            },
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield createAuthors();
        yield createGenres();
        yield createBooks();
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
//# sourceMappingURL=seed.js.map