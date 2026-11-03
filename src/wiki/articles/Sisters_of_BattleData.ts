// Auto-generated from https://warhammer-guide.ru/wiki/Sisters_of_Battle.html — do not edit by hand.
// Regenerate: python3 scripts/fetch-wiki-articles.py
export interface WikiRun {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  link?: string;
  runs?: WikiRun[];
  image?: string;
  alt?: string;
  br?: boolean;
}
export interface WikiCell {
  header: boolean;
  colspan?: number;
  rowspan?: number;
  bg?: string;
  runs: WikiRun[];
}
export type WikiBlock =
  | { block: 'p'; runs: WikiRun[] }
  | { block: 'table'; cls?: string; width?: string; rows: WikiCell[][] }
  | { block: 'toc'; items: { level: number; n: string; text: string; href: string }[] };
export interface WikiSection {
  h: string;
  level: number;
  anchor?: string;
  blocks: WikiBlock[];
}
export const Sisters_of_BattleArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Sisters of Battle",
  "subtitle": "From RelicWiki",
  "sections": [
    {
      "h": "",
      "level": 0,
      "anchor": "",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": false,
                "runs": [
                  {
                    "link": "images/Dawn_of_War_logo.jpg",
                    "runs": [
                      {
                        "image": "images/80px-Dawn_of_War_logo.jpg",
                        "alt": "Dawn of War logo.jpg",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "This article is part of the ",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dawn_of_War_Players_Guide/",
                    "runs": [
                      {
                        "text": "Dawn of War Player's Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": ".",
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "http://wiki.reliccommunity.com/",
                    "runs": [
                      {
                        "text": "From RelicWiki",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "cls": "messagebox",
          "width": "auto",
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "toc",
          "items": [
            {
              "level": 0,
              "n": "1",
              "text": "Backstory",
              "href": "/settings/wiki/Sisters_of_Battle/#Backstory",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "1.1",
              "text": "Soulstorm",
              "href": "/settings/wiki/Sisters_of_Battle/#Soulstorm",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Sisters of Battle Units",
              "href": "/settings/wiki/Sisters_of_Battle/#Sisters_of_Battle_Units",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.1",
              "text": "Ecclesiarchal Servitor",
              "href": "/settings/wiki/Sisters_of_Battle/#Ecclesiarchal_Servitor",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.2",
              "text": "Missionary",
              "href": "/settings/wiki/Sisters_of_Battle/#Missionary",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.3",
              "text": "Battle Sister Squad",
              "href": "/settings/wiki/Sisters_of_Battle/#Battle_Sister_Squad",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.4",
              "text": "Seraphim Squad",
              "href": "/settings/wiki/Sisters_of_Battle/#Seraphim_Squad",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.5",
              "text": "Celestian Squad",
              "href": "/settings/wiki/Sisters_of_Battle/#Celestian_Squad",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.6",
              "text": "Death-Cult Assassin",
              "href": "/settings/wiki/Sisters_of_Battle/#Death-Cult_Assassin",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.7",
              "text": "Sister Repentia Squad",
              "href": "/settings/wiki/Sisters_of_Battle/#Sister_Repentia_Squad",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.8",
              "text": "Canoness",
              "href": "/settings/wiki/Sisters_of_Battle/#Canoness",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.9",
              "text": "Avenging Angel",
              "href": "/settings/wiki/Sisters_of_Battle/#Avenging_Angel",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.10",
              "text": "Confessor",
              "href": "/settings/wiki/Sisters_of_Battle/#Confessor",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.11",
              "text": "Living Saint",
              "href": "/settings/wiki/Sisters_of_Battle/#Living_Saint",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.12",
              "text": "Rhino Transport",
              "href": "/settings/wiki/Sisters_of_Battle/#Rhino_Transport",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.13",
              "text": "Immolator",
              "href": "/settings/wiki/Sisters_of_Battle/#Immolator",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.14",
              "text": "Lightning Fighter",
              "href": "/settings/wiki/Sisters_of_Battle/#Lightning_Fighter",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.15",
              "text": "Exorcist",
              "href": "/settings/wiki/Sisters_of_Battle/#Exorcist",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "2.16",
              "text": "Penitent Engine",
              "href": "/settings/wiki/Sisters_of_Battle/#Penitent_Engine",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Sisters of Battle Buildings",
              "href": "/settings/wiki/Sisters_of_Battle/#Sisters_of_Battle_Buildings",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.1",
              "text": "Ecclesiarchal Chapel",
              "href": "/settings/wiki/Sisters_of_Battle/#Ecclesiarchal_Chapel",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.2",
              "text": "Listening Post",
              "href": "/settings/wiki/Sisters_of_Battle/#Listening_Post",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.3",
              "text": "Plasma Generator]",
              "href": "/settings/wiki/Sisters_of_Battle/#Plasma_Generator.5D",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.4",
              "text": "Thermo Plasma Generator",
              "href": "/settings/wiki/Sisters_of_Battle/#Thermo_Plasma_Generator",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.5",
              "text": "Adepta Sororitas Convent",
              "href": "/settings/wiki/Sisters_of_Battle/#Adepta_Sororitas_Convent",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.6",
              "text": "Pristine Sanctuary",
              "href": "/settings/wiki/Sisters_of_Battle/#Pristine_Sanctuary",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.7",
              "text": "Manufactorum",
              "href": "/settings/wiki/Sisters_of_Battle/#Manufactorum",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.8",
              "text": "Holy Reliquary",
              "href": "/settings/wiki/Sisters_of_Battle/#Holy_Reliquary",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.9",
              "text": "Shrine of the Living Saint",
              "href": "/settings/wiki/Sisters_of_Battle/#Shrine_of_the_Living_Saint",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.10",
              "text": "Inferno Turret",
              "href": "/settings/wiki/Sisters_of_Battle/#Inferno_Turret",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.11",
              "text": "Purgatus Mine Field",
              "href": "/settings/wiki/Sisters_of_Battle/#Purgatus_Mine_Field",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "The Dawn of War Player's Guide",
              "href": "/settings/wiki/Sisters_of_Battle/#The_Dawn_of_War_Player.27s_Guide",
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Backstory",
      "level": 2,
      "anchor": "Backstory",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "The Adepta Sororitas has its origins on the world of San Leor. An order known as the Daughters of the Emperor, an all-female cult dedicated to worship of the Emperor, had been discovered there by members of the Ecclesiarchy. Goge Vandire, the High Lord of the Administratum (and also Ecclesiarch of the Adeptus Ministorum), decided to pay a visit to San Leor and recruit the Daughters into his own private army. The Daughters, at first, refused to accept his authority. Vandire decided to show them that he was blessed by the Emperor - he instructed a soldier in his entourage to shoot him, which after a brief hesitation, he did. However, thanks to the protective field generated by the Rosarius of the Ecclesiarch (which no one but Vandire himself was aware of), Vandire was not harmed. The Daughters took this to be a sign, and swore allegiance to Vandire virtually on the spot. They became the Brides of the Emperor, and were Vandire's most loyal followers.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "During the Siege of the Ecclesiarchal Palace, the Adeptus Custodes, the praetorians of the Emperor himself, tried to approach the Brides and convince them of Vandire's treachery. In a last ditch effort to convince them, the Custodes took Alicia Dominica, leader of the Brides, and her chosen bodyguards deep into the Imperial Palace where they stood before the Emperor himself. What happened there remains unknown - Dominica and her companions were sworn to secrecy - but it became clear that the Brides, who reverted to the title of Daughters of the Emperor, had been awakened to the \nevil that Vandire represented. Marching into his audience chamber, Dominica paused only to condemn Vandire for his crimes before she beheaded the power-crazed dictator. Reportedly, Vandire's final words were \"I don't have time to die - I'm too busy!\"\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "After this episode, the Decree Passive was proclaimed by newly appointed Ecclesiarch Sebastian Thor. Under the literal interpretation of the decree however, the Adepta Sororitas were not obligated to disband because the decree made only explicit mention of \"",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "men",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " under arms.\" Thor, recognizing the need for the Ecclesiarchy to have some kind of force and internal regulator, allowed them to remain, even if the spirit of the decree was rather blatantly disregarded.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Soulstorm",
      "level": 3,
      "anchor": "Soulstorm",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Sisters of Battle Units",
      "level": 2,
      "anchor": "Sisters_of_Battle_Units",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Ecclesiarchal Servitor",
      "level": 3,
      "anchor": "Ecclesiarchal_Servitor",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Sisters_Servitor.jpg",
              "runs": [
                {
                  "image": "images/Sisters_Servitor.jpg",
                  "alt": "Sisters Servitor.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"The Machine Spirit sings in me.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Ecclesiarchal Servitors act as builders for the Sisters of Battle. Somewhat similar to the Imperial Guard's ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Techpriest_Enginseer/",
              "runs": [
                {
                  "text": "Techpriest Enginseer",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", they are dispatched first into combat zones to provide essential infrastructure for the Sister's campaigns as well as providing maintenance for damaged vehicles and buildings. They are also commonly deployed following the successful capture of enemy fortifications to dismantle buildings. They are assisted in performing their duties by the cybernetic upgrades their masters provide. With metal servo-arms, they work much faster and more efficiently than any normal human.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Ecclesiarchal_Servitor/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Missionary",
      "level": 3,
      "anchor": "Missionary",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Sisters_Missionary.jpg",
              "runs": [
                {
                  "image": "images/Sisters_Missionary.jpg",
                  "alt": "Sisters Missionary.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"From the lightning, and the tempest, Emperor deliver us!\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "At the forefront of Ecclesiarchy crusades, Missionaries travel to worlds where the Emperor is not worshipped and convert the populace. Their tenacity and infinite faith make them excellent scout and support units, as they use Acts of Faith to bolster the strength of the squad they are attached to.  The Missionary is the only detector unit in Tier 1.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Missionary/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Battle Sister Squad",
      "level": 3,
      "anchor": "Battle_Sister_Squad",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Battle_Sister_Squad.jpg",
              "runs": [
                {
                  "image": "images/Battle_Sister_Squad.jpg",
                  "alt": "Battle Sister Squad.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Death to the impure!\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The holy avengers of the Emperor's glory, Battle Sisters cause dread in the souls of sinners across the vast galaxy. Highly trained and adaptable to the changing conditions of the battlefield, the Battle Sisters have access to a broad range of weapon upgrades and more than a match for any Infantry and Heavy Infantry units that dares stand against them.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Battle_Sister_Squad/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Seraphim Squad",
      "level": 3,
      "anchor": "Seraphim_Squad",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Seraphim_Squad.jpg",
              "runs": [
                {
                  "image": "images/Seraphim_Squad.jpg",
                  "alt": "Seraphim Squad.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"We fall upon the infidels.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Soaring over the grim battlefields like angels of vengeance, the Seraphim Squad rains down fire and damnation on those sinners foolish enough to raise arms against the Ecclesiarchy. This fast attack combat unit operates close to the front lines, delivering lighting strikes against infantry units and dropping Krak grenades against vehicles and fortifications. The sight of the Seraphim overhead provides confidence to their allies and they generate Faith attribute necessary to power the Acts of Faith.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Seraphim_Squad/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Celestian Squad",
      "level": 3,
      "anchor": "Celestian_Squad",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Sisters_celestians_image.jpg",
              "runs": [
                {
                  "image": "images/Sisters_celestians_image.jpg",
                  "alt": "Sisters celestians image.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"We purge with righteous zeal.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Celestians are a hard-hitting anti-vehicle and building unit, also quite capable in melee with their chainswords. The main anti-armour unit for the Sisters Of Battle, Celestian Squads are called upon to quickly destroy non-infantry threats with their melta weaponry.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Celestian_Squad/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Death-Cult Assassin",
      "level": 3,
      "anchor": "Death-Cult_Assassin",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Death-Cult_Assassin.jpg",
              "runs": [
                {
                  "image": "images/Death-Cult_Assassin.jpg",
                  "alt": "Death-Cult Assassin.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"I whisper to my blades 'Kill, kill!'\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "When the Adeptus Ministorum needs someone slain, they call upon their daughters of death, the lethal and fanatical Death-Cult Assassins. Preternaturally agile and capable of dodging the most vicious melee attacks, the Assassins slip behind enemy lines slaying commanders and other key personnel. In addition, the Death-Cult's stealth and observation skills (she is a detector as well as an infiltrator) make them ideal for spotting enemy units infiltrating their main force. A few well-placed Death-Cult Assassins in the right locations can cause more confusion and terror than a heavy tank.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Death-Cult_Assassin/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Sister Repentia Squad",
      "level": 3,
      "anchor": "Sister_Repentia_Squad",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Sister_Repentia_Squad.jpg",
              "runs": [
                {
                  "image": "images/Sister_Repentia_Squad.jpg",
                  "alt": "Sister Repentia Squad.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"To the Emperor, my life; to Him, my death.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Outcast for some past sin, the Sisters Repentia seek death and thus absolution in the heat of battle. They have brutal melee combat capabilities and are heavily armed solely with the deadly Eviscerator, making them all but unstoppable. While always threatened by opponents who excel with firearms, no one dares stand before the Sisters Repentia toe-to-toe.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Sister_Repentia_Squad/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Canoness",
      "level": 3,
      "anchor": "Canoness",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Sisters_Canoness_image.jpg",
              "runs": [
                {
                  "image": "images/Sisters_Canoness_image.jpg",
                  "alt": "Sisters Canoness image.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Thou shalt not! I shall!\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The overall leaders of the Sisters of Battle, the Canoness commands the Ecclesiarchal forces of the Imperium. Her unwavering devotion to the cause boosts the morale of units she is attached to. She is a versatile combatant, skilled at both ranged and melee attacks. Finally, her boundless fanaticism marks her as a Faithful unit, providing the Faith resource while she remains in the battlefield.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Canoness/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Avenging Angel",
      "level": 3,
      "anchor": "Avenging_Angel",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Avenging_Angel.jpg",
              "runs": [
                {
                  "image": "images/Avenging_Angel.jpg",
                  "alt": "Avenging Angel.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Avenging Angels are not built. They are summoned from fallen Sisters by the use of the Canoness's Act of Faith: Ascension. They last only 30 seconds.  They can detect hidden units.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Avenging_Angel/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Confessor",
      "level": 3,
      "anchor": "Confessor",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Confessor.jpg",
              "runs": [
                {
                  "image": "images/Confessor.jpg",
                  "alt": "Confessor.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"I have come to pass judgement.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "An empire as vast and uncaring as the Imperium of Mankind needs strict discipline to keep it on the path to righteousness. This solemn duty falls to the Confessors. These solitary crusaders wander the Imperium, seeking out heresy in all forms and delivering judgement in the Emperor's name. A superior melee combatant who commands Acts of Faith to damage and stun his enemies, the Confessor is an awe-inspiring addition to any dedicated Ecclesiarchal force.  The Confessor is a detector unit.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Confessor/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Living Saint",
      "level": 3,
      "anchor": "Living_Saint",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Living_Saint.jpg",
              "runs": [
                {
                  "image": "images/Living_Saint.jpg",
                  "alt": "Living Saint.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"I bring salvation through annihilation.\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " \n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "An unstoppable juggernaut of Holy wrath, the Living Saint all but assures a quick and decisive victory when it appears on a battlefield. This angel of death soars over the battlefield, unleashing ruin on the enemy with an awe-inspiring array of  powerful abilities. In addition, her connection to the God-Emperor allows her to miraculously resurrect after death. An appearance by the Living Saint generates a large amount of Faith resources, as she calls other devoted Sisters to join her in the fight to cleanse the universe of the heretics that stain the sight of the faithful.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Living_Saint/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Rhino Transport",
      "level": 3,
      "anchor": "Rhino_Transport",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/SoB_Rhino_Transport.jpg",
              "runs": [
                {
                  "image": "images/SoB_Rhino_Transport.jpg",
                  "alt": "SoB Rhino Transport.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Taste my storm bolter!\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The crews of the Rhino Transports have a sacred duty to transport Sisters of Battle units directly to the frontline. This heavily armored vehicle can be equipped with Laud Hailers, spreading the gospel of the Imperium through heavily amplified speakers across the battlefield. In addition, the Rhino is equipped with storm bolters capable of combating Infantry units foolish enough to get in the way.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Rhino_Transport/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Immolator",
      "level": 3,
      "anchor": "Immolator",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Immolator.jpg",
              "runs": [
                {
                  "image": "images/Immolator.jpg",
                  "alt": "Immolator.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Behold! The Immolator!\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Lighting up the sky in bursts of Holy flame, the Immolator delivers justice to the lost souls that stand against the light of the Ecclesiarchy. This assault vehicle can take the worst punishment that the enemy can throw against it, all the while burning its way through any infantry of building units. Finally it can upgrade to Multi-Meltas, which make short work of buildings and vehicles.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Immolator/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Lightning Fighter",
      "level": 3,
      "anchor": "Lightning_Fighter",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Lightning_Fighter.jpg",
              "runs": [
                {
                  "image": "images/Lightning_Fighter.jpg",
                  "alt": "Lightning Fighter.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Faster than blasphemy!\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Crewed by their skilled pilots, the Lightning Fighter is one of the finest fighters of the Imperial Navy. Soaring over the battlefield , it provides air support to fellow disciples and engages in dogfights with enemy forces. Roaring over the unclean battlefields of sinners and heretics, the Lightning Fighter is one of the greatest tools the Sisters of Battle have to enact the Emperor's will.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Lightning_Fighter/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Exorcist",
      "level": 3,
      "anchor": "Exorcist",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Exorcist.jpg",
              "runs": [
                {
                  "image": "images/Exorcist.jpg",
                  "alt": "Exorcist.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "\"Do you hear the organs play?\"",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The Artillery backbone of the Adeptus Ministorum, the Exorcist is capable of firing a cluster of missiles that can cause tremendous devastation across enemy forces. The weapons payload can be fired at a long range and do not require line of sight, making it ideal for hammering at an enemy's fortification before beginning a major assault. Artillery is highly inaccurate, particularly firing blind and a skilled commander must master this skill if they are going to be a successful servant of the Ecclesiarchy.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Exorcist/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Penitent Engine",
      "level": 3,
      "anchor": "Penitent_Engine",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Penitent_Engine.jpg",
              "runs": [
                {
                  "image": "images/Penitent_Engine.jpg",
                  "alt": "Penitent Engine.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "When a repentant heretic's crimes are so heinous that even arco-flagellation is not punishment enough, he may be interred in one of the ancient and holy shriving machines known as Penitent Engines. The Penitent Engine meets the enemy in close-quarter combat and is very effective against heretics who unwisely approach for melee. In addition, it makes an ideal leader in a siege situation where it can quickly dispatch major defenders while the rest of the assault catches up.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Penitent_Engine/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Sisters of Battle Buildings",
      "level": 2,
      "anchor": "Sisters_of_Battle_Buildings",
      "blocks": [],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Ecclesiarchal Chapel",
      "level": 3,
      "anchor": "Ecclesiarchal_Chapel",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Ecclesiarchal_Chapel.jpg",
              "runs": [
                {
                  "image": "images/Ecclesiarchal_Chapel.jpg",
                  "alt": "Ecclesiarchal Chapel.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The primary fortification in the Ecclesiarchy's never-ending war against heresy, the Ecclesiarchal Chapel provides builders and basic infantry for an Adeptus Ministorum commander. Ecclesiarchal Servitors, Missionaries, and Confessors deploy from the chapel. The chapel projects a Control Area around itself, allowing other buildings to be built near it. It can be upgraded to the imposing Ecclesiarchal Cathedral, or the awe-inspiring Ecclesiarchal Citadel.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Ecclesiarchal_Chapel/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Listening Post",
      "level": 3,
      "anchor": "Listening_Post",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Listening_Post_Sisters.jpg",
              "runs": [
                {
                  "image": "images/Listening_Post_Sisters.jpg",
                  "alt": "Listening Post Sisters.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The electronic ears of the battlefield, Listening Posts are quickly built over claimed strategic points, allowing a greater foothold into freshly captured territory. Listening posts increase the Requisition resource production rate of your army, and can be upgraded with weapons, making them formidable defensive structures. Finally, a Holy Icon can be placed on top, illuminating infiltrating units with the Emperor's unwavering gaze and increasing your maximum Faith value.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Listening_Post_Sisters_of_Battle/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Plasma Generator]",
      "level": 3,
      "anchor": "Plasma_Generator.5D",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/SoB_Plasma_Generator.jpg",
              "runs": [
                {
                  "image": "images/SoB_Plasma_Generator.jpg",
                  "alt": "SoB Plasma Generator.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The Plasma Generator generates the Power resource, which is essential for creating and deploying units, building structures, and upgrading your technology. You can only build six Plasma Generators per Ecclesiarchal Chapel. When destroyed Plasma Generators will damage any nearby unit or structure.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Plasma_Generator_Sisters_of_Battle/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Thermo Plasma Generator",
      "level": 3,
      "anchor": "Thermo_Plasma_Generator",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/SoB_Thermo_Plasma_Generator.jpg",
              "runs": [
                {
                  "image": "images/SoB_Thermo_Plasma_Generator.jpg",
                  "alt": "SoB Thermo Plasma Generator.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Thermo Plasma Generators give a huge Power bonus but can only be built on Slag Deposits which are, as a result, often highly prized and fought over tenaciously.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Thermo_Plasma_Generator_Sisters_of_Battle/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Adepta Sororitas Convent",
      "level": 3,
      "anchor": "Adepta_Sororitas_Convent",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Adepta_Sororitas_Convent.jpg",
              "runs": [
                {
                  "image": "images/Adepta_Sororitas_Convent.jpg",
                  "alt": "Adepta Sororitas Convent.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Training ground and spiritual center for the Sisters of Battle, the Adepta Sororitas Convent stands in grim majesty over a million conquered worlds. Canonesses, Battle Sister Squads, Seraphim Squads, Sister Repentia Squads, Celestian Squads, and Death-Cult Assassins can all be found in its hallowed halls, while Imperial Tacticians conduct endless logistics research to more effectively produce and manage infantry units.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Adepta_Sororitas_Convent/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Pristine Sanctuary",
      "level": 3,
      "anchor": "Pristine_Sanctuary",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Pristine_Sanctuary.jpg",
              "runs": [
                {
                  "image": "images/Pristine_Sanctuary.jpg",
                  "alt": "Pristine Sanctuary.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "A serene oasis in the confusion of battle, the Pristine Sanctuary host the finest minds in the Ecclesiarchy, all working to assist the Sisters of Battle in their blessed work. A research facility of unequaled ability, the Pristine Sanctuary can improve the basic weapons of the various Sisters of Battle squads, equip buildings with morale-boosting Laud Hailers, and can sharpen the minds and souls of infantry battallions and Veteran Superiors. Finally, the technicians of the Pristine Sanctuary are invaluable to the construction of Inferno Turrets and upgrading the Ecclusiarchal Cathedral.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Pristine_Sanctuary/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Manufactorum",
      "level": 3,
      "anchor": "Manufactorum",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Manufactorum.jpg",
              "runs": [
                {
                  "image": "images/Manufactorum.jpg",
                  "alt": "Manufactorum.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The Manufactorum is the point of construction and delivery for the Adeptus Mechanicus' mighty vehicles. Rhino Transports, Immolators, Exorcists, Penitent Engines, and the fierce Lightning Fighter units are all deployed from the Manufactorum, and immediate construction of the building is vital to an effective Commander's strategy. In addition, the Manufactorum contains research abilities to increase vehicle cap.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Manufactorum/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Holy Reliquary",
      "level": 3,
      "anchor": "Holy_Reliquary",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Holy_Reliquary.jpg",
              "runs": [
                {
                  "image": "images/Holy_Reliquary.jpg",
                  "alt": "Holy Reliquary.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Over the centuries, hundreds of devoted Sisters of Battle have fought and fallen in the Emperor's name. The greatest of their number are entombed in the sanctuaries of the Holy Reliquary, serving as a constant reminder to the Ecclesiarchal forces of the solemn cost of their sacred duty. This somber edifice acts as strongpoint for the Sisters of Battle's strongest warriors and is required for deploying the Confessor.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Holy_Reliquary/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Shrine of the Living Saint",
      "level": 3,
      "anchor": "Shrine_of_the_Living_Saint",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Shrine_of_the_Living_Saint.jpg",
              "runs": [
                {
                  "image": "images/Shrine_of_the_Living_Saint.jpg",
                  "alt": "Shrine of the Living Saint.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "The single most formidable unit in the Sisters of Battle is the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Living_Saint/",
              "runs": [
                {
                  "text": "Living Saint",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", a warrior of light and devotion in the Ecclesiarcy's war across the unfeeling universe. When a Commander completes the construction of this building, they can call upon this elemental force to smite their enemies.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Shrine_of_the_Living_Saint/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Inferno Turret",
      "level": 3,
      "anchor": "Inferno_Turret",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Inferno_Turret.jpg",
              "runs": [
                {
                  "image": "images/Inferno_Turret.jpg",
                  "alt": "Inferno Turret.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "Equipped with twin-linked Inferno Cannons, the Inferno Turret is highly effective against advancing infantry units. In addition, movement sensors and hard-audible technology allow the emplacements to detect enemy infiltrators and make this a wise addition to any cautious Commander's perimeter defences.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Inferno_Turret/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "Purgatus Mine Field",
      "level": 3,
      "anchor": "Purgatus_Mine_Field",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Purgatus_Mine_Field.jpg",
              "runs": [
                {
                  "image": "images/Purgatus_Mine_Field.jpg",
                  "alt": "Purgatus Mine Field.jpg",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "text": "An excellent method to reinforce unsecured areas and hinder advancing enemy forces, Purgatus Mine Fields burst into flame when enemy units pass over them. Unseen by most enemy units until detonation, the Purgatus Mine Field can cause tremendous devastation to the unwary.\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        },
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Purgatus_Mine_Field/",
              "runs": [
                {
                  "text": "More Information",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "\n",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "br": true,
              "image": "",
              "alt": "",
              "link": ""
            }
          ],
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    },
    {
      "h": "The Dawn of War Player's Guide",
      "level": 2,
      "anchor": "The_Dawn_of_War_Player.27s_Guide",
      "blocks": [
        {
          "block": "table",
          "rows": [
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dawn_of_War_Players_Guide/",
                    "runs": [
                      {
                        "text": "The Dawn of War Player's Guide",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "text": " - Thought of the day: Knowledge is power, guard it well.\n",
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "colspan": 9,
                "bg": "#ccddcc",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Space_Marines/",
                    "runs": [
                      {
                        "text": "Space Marines",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Chaos/",
                    "runs": [
                      {
                        "text": "Chaos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Orks/",
                    "runs": [
                      {
                        "text": "Orks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Imperial Guard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Tau/",
                    "runs": [
                      {
                        "text": "Tau",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Necrons/",
                    "runs": [
                      {
                        "text": "Necrons",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Dark Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Sisters of Battle",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Servitor/",
                    "runs": [
                      {
                        "text": "Servitor",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Scout_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Scout Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Space_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Space Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Assault_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Assault Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Grey_Knights/",
                    "runs": [
                      {
                        "text": "Grey Knights",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Terminator_Squad/",
                    "runs": [
                      {
                        "text": "Terminator Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Assault_Terminator_Squad/",
                    "runs": [
                      {
                        "text": "Assault Terminator Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Skull_Probe/",
                    "runs": [
                      {
                        "text": "Skull Probe",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Apothecary/",
                    "runs": [
                      {
                        "text": "Apothecary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Force_Commander/",
                    "runs": [
                      {
                        "text": "Force Commander",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Librarian/",
                    "runs": [
                      {
                        "text": "Librarian",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaplain/",
                    "runs": [
                      {
                        "text": "Chaplain",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heretic/",
                    "runs": [
                      {
                        "text": "Heretic",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Cultist_Squad/",
                    "runs": [
                      {
                        "text": "Cultist Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Space_Marine_Squad/",
                    "runs": [
                      {
                        "text": "Chaos Space Marine Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Raptor_Squad/",
                    "runs": [
                      {
                        "text": "Raptor Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Khorne_Berzerker_Squad/",
                    "runs": [
                      {
                        "text": "Khorne Berzerker Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Horror_Squad/",
                    "runs": [
                      {
                        "text": "Horror Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Possessed_Squad/",
                    "runs": [
                      {
                        "text": "Possessed Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Obliterators/",
                    "runs": [
                      {
                        "text": "Obliterators",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Lord/",
                    "runs": [
                      {
                        "text": "Chaos Lord",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Sorcerer/",
                    "runs": [
                      {
                        "text": "Chaos Sorcerer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Daemon_Prince/",
                    "runs": [
                      {
                        "text": "Daemon Prince",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Bloodthirster/",
                    "runs": [
                      {
                        "text": "Bloodthirster",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Bonesinger/",
                    "runs": [
                      {
                        "text": "Bonesinger",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Guardian_Squad/",
                    "runs": [
                      {
                        "text": "Guardian Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ranger_Squad/",
                    "runs": [
                      {
                        "text": "Ranger Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Howling_Banshee_Squad/",
                    "runs": [
                      {
                        "text": "Howling Banshee Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dark_Reaper_Squad/",
                    "runs": [
                      {
                        "text": "Dark Reaper Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Dragon/",
                    "runs": [
                      {
                        "text": "Fire Dragon Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warp_Spider_Squad/",
                    "runs": [
                      {
                        "text": "Warp Spider Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Harlequin/",
                    "runs": [
                      {
                        "text": "Harlequin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Farseer/",
                    "runs": [
                      {
                        "text": "Farseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seer_Council/",
                    "runs": [
                      {
                        "text": "Seer Council",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Avatar_of_Khaine/",
                    "runs": [
                      {
                        "text": "Avatar of Khaine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Gretchin/",
                    "runs": [
                      {
                        "text": "Gretchin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Slugga_Boy_Squad/",
                    "runs": [
                      {
                        "text": "Slugga Boy Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Shoota_Boy_Squad/",
                    "runs": [
                      {
                        "text": "Shoota Boy Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Stormboyz/",
                    "runs": [
                      {
                        "text": "Stormboyz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tankbustaz/",
                    "runs": [
                      {
                        "text": "Tankbustaz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Nobz_Squad/",
                    "runs": [
                      {
                        "text": "Nobz Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Flash_Gitz/",
                    "runs": [
                      {
                        "text": "Flash Gitz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mega_Armoured_Nobz/",
                    "runs": [
                      {
                        "text": "Mega Armoured Nobz",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mad_Dok/",
                    "runs": [
                      {
                        "text": "Mad Dok",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Big_Mek/",
                    "runs": [
                      {
                        "text": "Big Mek",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warboss/",
                    "runs": [
                      {
                        "text": "Warboss",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Techpriest_Enginseer/",
                    "runs": [
                      {
                        "text": "Techpriest Enginseer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/guardsmen_squad/",
                    "runs": [
                      {
                        "text": "Guardsmen Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Weapons_Team/",
                    "runs": [
                      {
                        "text": "Heavy Weapons Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kasrkin/",
                    "runs": [
                      {
                        "text": "Kasrkin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ogryns/",
                    "runs": [
                      {
                        "text": "Ogryns",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Command_Squad/",
                    "runs": [
                      {
                        "text": "Command Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Commissar/",
                    "runs": [
                      {
                        "text": "Commissar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Psyker/",
                    "runs": [
                      {
                        "text": "Psyker",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Priest/",
                    "runs": [
                      {
                        "text": "Priest",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vindicare_Assassin/",
                    "runs": [
                      {
                        "text": "Vindicare Assassin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Earth_Caste_Builder/",
                    "runs": [
                      {
                        "text": "Earth Caste Builder",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/XV15_Stealth_Team/",
                    "runs": [
                      {
                        "text": "XV15 Stealth Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vespid_Stingwing_Strain/",
                    "runs": [
                      {
                        "text": "Vespid Stingwing Strain",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Warrior_Team/",
                    "runs": [
                      {
                        "text": "Fire Warrior Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Carnivores/",
                    "runs": [
                      {
                        "text": "Kroot Carnivores",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Shaper/",
                    "runs": [
                      {
                        "text": "Kroot Shaper",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pathfinder_Team/",
                    "runs": [
                      {
                        "text": "Pathfinder Team",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/XV88_Broadside_Battlesuit/",
                    "runs": [
                      {
                        "text": "XV88 Broadside Battlesuit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/XV8_Crisis_Battlesuit/",
                    "runs": [
                      {
                        "text": "XV8 Crisis Battlesuit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Hound_Pack/",
                    "runs": [
                      {
                        "text": "Kroot Hound Pack",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tau_Commander/",
                    "runs": [
                      {
                        "text": "Tau Commander",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ethereal/",
                    "runs": [
                      {
                        "text": "Ethereal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/ShasUi_Bodyguard/",
                    "runs": [
                      {
                        "text": "Shas'Ui Bodyguard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Builder_Scarabs/",
                    "runs": [
                      {
                        "text": "Builder Scarabs",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Warriors/",
                    "runs": [
                      {
                        "text": "Necron Warriors",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wraith/",
                    "runs": [
                      {
                        "text": "Wraith",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Flayed_Ones/",
                    "runs": [
                      {
                        "text": "Flayed Ones",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Immortals/",
                    "runs": [
                      {
                        "text": "Immortals",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pariahs/",
                    "runs": [
                      {
                        "text": "Pariahs",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Necron_Lord/",
                    "runs": [
                      {
                        "text": "Necron Lord",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Essence_of_the_Nightbringer/",
                    "runs": [
                      {
                        "text": "Essence of the Nightbringer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Essence_of_the_Deceiver/",
                    "runs": [
                      {
                        "text": "Essence of the Deceiver",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tortured_Slave/",
                    "runs": [
                      {
                        "text": "Tortured Slave",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mandrake_Squad/",
                    "runs": [
                      {
                        "text": "Mandrake Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warrior_Squad/",
                    "runs": [
                      {
                        "text": "Warrior Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hellion_Squad/",
                    "runs": [
                      {
                        "text": "Hellion Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Scourge_Squad/",
                    "runs": [
                      {
                        "text": "Scourge Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wych_Squad/",
                    "runs": [
                      {
                        "text": "Wych Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Warp_Beast_Pack/",
                    "runs": [
                      {
                        "text": "Warp Beast Pack",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Archon/",
                    "runs": [
                      {
                        "text": "Archon",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Haemonculus/",
                    "runs": [
                      {
                        "text": "Haemonculus",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Infantry",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ecclesiarchal_Servitor/",
                    "runs": [
                      {
                        "text": "Ecclesiarchal Servitor",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Missionary/",
                    "runs": [
                      {
                        "text": "Missionary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Battle_Sister_Squad/",
                    "runs": [
                      {
                        "text": "Battle Sister Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Seraphim_Squad/",
                    "runs": [
                      {
                        "text": "Seraphim Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Celestian_Squad/",
                    "runs": [
                      {
                        "text": "Celestian Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Death-Cult_Assassin/",
                    "runs": [
                      {
                        "text": "Death-Cult Assassin",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sister_Repentia_Squad/",
                    "runs": [
                      {
                        "text": "Sister Repentia Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Canoness/",
                    "runs": [
                      {
                        "text": "Canoness",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Avenging_Angel/",
                    "runs": [
                      {
                        "text": "Avenging Angel",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Confessor/",
                    "runs": [
                      {
                        "text": "Confessor",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Living_Saint/",
                    "runs": [
                      {
                        "text": "Living Saint",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Space_Marines/",
                    "runs": [
                      {
                        "text": "Space Marines",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Chaos/",
                    "runs": [
                      {
                        "text": "Chaos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Orks/",
                    "runs": [
                      {
                        "text": "Orks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Imperial Guard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Tau/",
                    "runs": [
                      {
                        "text": "Tau",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Necrons/",
                    "runs": [
                      {
                        "text": "Necrons",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Dark Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Sisters of Battle",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Rhino/",
                    "runs": [
                      {
                        "text": "Rhino",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Land_Speeder/",
                    "runs": [
                      {
                        "text": "Land Speeder",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dreadnought/",
                    "runs": [
                      {
                        "text": "Dreadnought",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hellfire_Dreadnought/",
                    "runs": [
                      {
                        "text": "Hellfire Dreadnought",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Land_Speeder_Tempest/",
                    "runs": [
                      {
                        "text": "Land Speeder Tempest",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Predator/",
                    "runs": [
                      {
                        "text": "Predator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Whirlwind/",
                    "runs": [
                      {
                        "text": "Whirlwind",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Land_Raider/",
                    "runs": [
                      {
                        "text": "Land Raider",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Rhino/",
                    "runs": [
                      {
                        "text": "Chaos Rhino",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Defiler/",
                    "runs": [
                      {
                        "text": "Defiler",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Predator/",
                    "runs": [
                      {
                        "text": "Chaos Predator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hell_Talon/",
                    "runs": [
                      {
                        "text": "Hell Talon",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Falcon_Grav_Tank/",
                    "runs": [
                      {
                        "text": "Falcon Grav Tank",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vyper/",
                    "runs": [
                      {
                        "text": "Vyper",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wraithlord/",
                    "runs": [
                      {
                        "text": "Wraithlord",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Nightwing/",
                    "runs": [
                      {
                        "text": "Nightwing",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Shuriken_Grav_Platform/",
                    "runs": [
                      {
                        "text": "Shuriken Grav Platform",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Brightlance_Grav_Platform/",
                    "runs": [
                      {
                        "text": "Brightlance Grav Platform",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fire_Prism/",
                    "runs": [
                      {
                        "text": "Fire Prism",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wartrukk/",
                    "runs": [
                      {
                        "text": "Wartrukk",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wartrak/",
                    "runs": [
                      {
                        "text": "Wartrak",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Killa_Kan/",
                    "runs": [
                      {
                        "text": "Killa Kan",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Fighta-Bomma/",
                    "runs": [
                      {
                        "text": "Fighta-Bomma",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Looted_Tank/",
                    "runs": [
                      {
                        "text": "Looted Tank",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Squiggoth/",
                    "runs": [
                      {
                        "text": "Squiggoth",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chimera/",
                    "runs": [
                      {
                        "text": "Chimera",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sentinel/",
                    "runs": [
                      {
                        "text": "Sentinel",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hellhound/",
                    "runs": [
                      {
                        "text": "Hellhound",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Basilisk/",
                    "runs": [
                      {
                        "text": "Basilisk",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Marauder_Bomber/",
                    "runs": [
                      {
                        "text": "Marauder Bomber",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Leman_Russ/",
                    "runs": [
                      {
                        "text": "Leman Russ",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Baneblade/",
                    "runs": [
                      {
                        "text": "Baneblade",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Devilfish_Troop_Carrier/",
                    "runs": [
                      {
                        "text": "Devilfish Troop Carrier",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Skyray_Missile_Gunship/",
                    "runs": [
                      {
                        "text": "Skyray Missile Gunship",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Drone_Squad/",
                    "runs": [
                      {
                        "text": "Drone Squad",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Drone_Harbinger/",
                    "runs": [
                      {
                        "text": "Drone Harbinger",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Barracuda/",
                    "runs": [
                      {
                        "text": "Barracuda",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hammerhead_Gunship/",
                    "runs": [
                      {
                        "text": "Hammerhead Gunship",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Krootox/",
                    "runs": [
                      {
                        "text": "Krootox",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Greater_Knarloc/",
                    "runs": [
                      {
                        "text": "Greater Knarloc",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tomb_Spyder/",
                    "runs": [
                      {
                        "text": "Tomb Spyder",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Attack_Scarabs/",
                    "runs": [
                      {
                        "text": "Attack Scarabs",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Destroyer/",
                    "runs": [
                      {
                        "text": "Destroyer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Destroyer/",
                    "runs": [
                      {
                        "text": "Heavy Destroyer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Lord_Destroyer/",
                    "runs": [
                      {
                        "text": "Lord Destroyer",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Restored_Monolith/",
                    "runs": [
                      {
                        "text": "Restored Monolith",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Reaver_Jetbike/",
                    "runs": [
                      {
                        "text": "Reaver Jetbike",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Raider/",
                    "runs": [
                      {
                        "text": "Raider",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Talos/",
                    "runs": [
                      {
                        "text": "Talos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Raven/",
                    "runs": [
                      {
                        "text": "Raven",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ravager/",
                    "runs": [
                      {
                        "text": "Ravager",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dais_of_Destruction/",
                    "runs": [
                      {
                        "text": "Dais of Destruction",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Vehicles",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Rhino_Transport/",
                    "runs": [
                      {
                        "text": "Rhino Transport",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Immolator/",
                    "runs": [
                      {
                        "text": "Immolator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Lightning_Fighter/",
                    "runs": [
                      {
                        "text": "Lightning Fighter",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Exorcist/",
                    "runs": [
                      {
                        "text": "Exorcist",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Penitent_Engine/",
                    "runs": [
                      {
                        "text": "Penitent Engine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Space_Marines/",
                    "runs": [
                      {
                        "text": "Space Marines",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Chaos/",
                    "runs": [
                      {
                        "text": "Chaos",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Eldar/",
                    "runs": [
                      {
                        "text": "Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Orks/",
                    "runs": [
                      {
                        "text": "Orks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Imperial Guard",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Tau/",
                    "runs": [
                      {
                        "text": "Tau",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Necrons/",
                    "runs": [
                      {
                        "text": "Necrons",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "link": "/settings/wiki/Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Dark Eldar",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": true,
                "runs": [
                  {
                    "text": "Sisters of Battle",
                    "bold": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "bg": "#b0c4de",
                "image": "",
                "alt": "",
                "link": ""
              }
            ],
            [
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Stronghold/",
                    "runs": [
                      {
                        "text": "Stronghold",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Space_Marines/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Space_Marines/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Space_Marines/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chapel-Barracks/",
                    "runs": [
                      {
                        "text": "Chapel-Barracks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Armoury/",
                    "runs": [
                      {
                        "text": "Armoury",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Machine_Cult/",
                    "runs": [
                      {
                        "text": "Machine Cult",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sacred_Artifact/",
                    "runs": [
                      {
                        "text": "Sacred Artifact",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Orbital_Relay/",
                    "runs": [
                      {
                        "text": "Orbital Relay",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Bolter_Turret_Space_Marines/",
                    "runs": [
                      {
                        "text": "Heavy Bolter Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Space_Marines/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Desecrated_Stronghold/",
                    "runs": [
                      {
                        "text": "Desecrated Stronghold",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Chaos/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Chaos/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Chaos/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Temple/",
                    "runs": [
                      {
                        "text": "Chaos Temple",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Chaos_Armoury/",
                    "runs": [
                      {
                        "text": "Chaos Armoury",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Sacrificial_Circle/",
                    "runs": [
                      {
                        "text": "Sacrificial Circle",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Machine_Pit/",
                    "runs": [
                      {
                        "text": "Machine Pit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Daemon_Pit/",
                    "runs": [
                      {
                        "text": "Daemon Pit",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Bolter_Turret_Chaos/",
                    "runs": [
                      {
                        "text": "Heavy Bolter Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Chaos/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Webway_Assembly/",
                    "runs": [
                      {
                        "text": "Webway Assembly",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Shrine/",
                    "runs": [
                      {
                        "text": "Listening Shrine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Eldar/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Eldar/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Webway_Gate/",
                    "runs": [
                      {
                        "text": "Webway Gate",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Aspect_Portal/",
                    "runs": [
                      {
                        "text": "Aspect Portal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Soul_Shrine/",
                    "runs": [
                      {
                        "text": "Soul Shrine",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Support_Portal/",
                    "runs": [
                      {
                        "text": "Support Portal",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Support_Platform/",
                    "runs": [
                      {
                        "text": "Support Platform",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Eldar/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Settlement/",
                    "runs": [
                      {
                        "text": "Settlement",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Da_Listenin_Post/",
                    "runs": [
                      {
                        "text": "Da Listenin' Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Generator/",
                    "runs": [
                      {
                        "text": "Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Bigga_Generator/",
                    "runs": [
                      {
                        "text": "Bigga Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Waaagh_Banner/",
                    "runs": [
                      {
                        "text": "Waaagh! Banner",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Da_Boyz_Hut/",
                    "runs": [
                      {
                        "text": "Da Boyz Hut",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pile_O_Gunz/",
                    "runs": [
                      {
                        "text": "Pile O Gunz!",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Da_Mek_Shop/",
                    "runs": [
                      {
                        "text": "Da Mek Shop",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Orks/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Field_Command/",
                    "runs": [
                      {
                        "text": "Field Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Infantry_Command/",
                    "runs": [
                      {
                        "text": "Infantry Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tactica_Control/",
                    "runs": [
                      {
                        "text": "Tactica Control",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mechanized_Command/",
                    "runs": [
                      {
                        "text": "Mechanized Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mars_Pattern_Command/",
                    "runs": [
                      {
                        "text": "Mars Pattern Command",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Heavy_Bolter_Turret_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Heavy Bolter Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Mine_Field_Imperial_Guard/",
                    "runs": [
                      {
                        "text": "Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Cadre_Headquarters/",
                    "runs": [
                      {
                        "text": "Cadre Headquarters",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Tau/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Tau/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Tau/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tau_Barracks/",
                    "runs": [
                      {
                        "text": "Tau Barracks",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Path_to_Enlightenment/",
                    "runs": [
                      {
                        "text": "Path to Enlightenment",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kroot_Shaping_Center/",
                    "runs": [
                      {
                        "text": "Kroot Shaping Center",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Vehicle_Beacon/",
                    "runs": [
                      {
                        "text": "Vehicle Beacon",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kauyon_Command_Post/",
                    "runs": [
                      {
                        "text": "Kauyon Command Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Montka_Command_Post/",
                    "runs": [
                      {
                        "text": "Mont'ka Command Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Coalition_Center/",
                    "runs": [
                      {
                        "text": "Coalition Center",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dormant_Monolith/",
                    "runs": [
                      {
                        "text": "Dormant Monolith",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Obelisk/",
                    "runs": [
                      {
                        "text": "Obelisk",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Necrons/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Necrons/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Summoning_Core/",
                    "runs": [
                      {
                        "text": "Summoning Core",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Forbidden_Archive/",
                    "runs": [
                      {
                        "text": "Forbidden Archive",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Greater_Summoning_Core/",
                    "runs": [
                      {
                        "text": "Greater Summoning Core",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Energy_Core/",
                    "runs": [
                      {
                        "text": "Energy Core",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Gauss_Turret/",
                    "runs": [
                      {
                        "text": "Gauss Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Kabal_Fortress/",
                    "runs": [
                      {
                        "text": "Kabal Fortress",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Tower_of_Loathing/",
                    "runs": [
                      {
                        "text": "Tower of Loathing",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Dark_Eldar/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Slave_Chamber/",
                    "runs": [
                      {
                        "text": "Slave Chamber",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Hall_of_Blood/",
                    "runs": [
                      {
                        "text": "Hall of Blood",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Haemonculus_Laboratory/",
                    "runs": [
                      {
                        "text": "Haemonculus' Laboratory",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Dark_Foundry/",
                    "runs": [
                      {
                        "text": "Dark Foundry",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Wych-Cult_Arena/",
                    "runs": [
                      {
                        "text": "Wych-Cult Arena",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Soul_Cage/",
                    "runs": [
                      {
                        "text": "Soul Cage",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              },
              {
                "header": false,
                "runs": [
                  {
                    "text": "Buildings",
                    "italic": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Ecclesiarchal_Chapel/",
                    "runs": [
                      {
                        "text": "Ecclesiarchal Chapel",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Listening_Post_Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Listening Post",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Plasma_Generator_Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Thermo_Plasma_Generator_Sisters_of_Battle/",
                    "runs": [
                      {
                        "text": "Thermo Plasma Generator",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Adepta_Sororitas_Convent/",
                    "runs": [
                      {
                        "text": "Adepta Sororitas Convent",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Pristine_Sanctuary/",
                    "runs": [
                      {
                        "text": "Pristine Sanctuary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Manufactorum/",
                    "runs": [
                      {
                        "text": "Manufactorum",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Holy_Reliquary/",
                    "runs": [
                      {
                        "text": "Holy Reliquary",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Shrine_of_the_Living_Saint/",
                    "runs": [
                      {
                        "text": "Shrine of the Living Saint",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Inferno_Turret/",
                    "runs": [
                      {
                        "text": "Inferno Turret",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  },
                  {
                    "link": "/settings/wiki/Purgatus_Mine_Field/",
                    "runs": [
                      {
                        "text": "Purgatus Mine Field",
                        "image": "",
                        "alt": "",
                        "link": ""
                      }
                    ],
                    "image": "",
                    "alt": ""
                  },
                  {
                    "br": true,
                    "image": "",
                    "alt": "",
                    "link": ""
                  }
                ],
                "image": "",
                "alt": "",
                "link": ""
              }
            ]
          ],
          "cls": "toccolours",
          "image": "",
          "alt": "",
          "link": ""
        }
      ],
      "image": "",
      "alt": "",
      "link": ""
    }
  ],
  "image": "",
  "alt": "",
  "link": ""
};
