// Auto-generated from https://warhammer-guide.ru/wiki/Dawn_of_War_Soulstorm.html — do not edit by hand.
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
export const Dawn_of_War_SoulstormArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Dawn of War Soulstorm",
  "subtitle": "From RelicWiki",
  "sections": [
    {
      "h": "",
      "level": 0,
      "anchor": "",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Warhammer 40,000: Dawn of War - Soulstorm",
              "italic": true,
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " is the newly announced standalone expansion to ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War/",
              "runs": [
                {
                  "text": "Dawn of War",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". The expansion features an expanded meta-map style campaign and an additional two new races: the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Sisters_of_Battle/",
              "runs": [
                {
                  "text": "Sisters of Battle",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " and the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ".\n",
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
              "link": "images/Soulstorm_Coverart.jpg",
              "runs": [
                {
                  "image": "images/256px-Soulstorm_Coverart.jpg",
                  "alt": "Soulstorm Coverart.jpg",
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
              "link": "images/Soulstorm_Coverart.jpg",
              "runs": [
                {
                  "image": "/skins/common/images/magnify-clip.png",
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
        },
        {
          "block": "toc",
          "items": [
            {
              "level": 0,
              "n": "1",
              "text": "New features",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#New_features",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Gameplay Changes",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#Gameplay_Changes",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Interoperability with previous games",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#Interoperability_with_previous_games",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "New Races",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#New_Races",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.1",
              "text": "Dark Eldar",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#Dark_Eldar",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.2",
              "text": "Sisters of Battle",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#Sisters_of_Battle",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "5",
              "text": "Miscellaneous",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#Miscellaneous",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "6",
              "text": "See Also",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#See_Also",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "7",
              "text": "External Links",
              "href": "/settings/wiki/Dawn_of_War_Soulstorm/#External_Links",
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
      "h": "New features",
      "level": 2,
      "anchor": "New_features",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Flying units are being introduced into game play, as well as two new economy styles: The ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Sisters_of_Battle/",
              "runs": [
                {
                  "text": "Sisters of Battle",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": "'s faith and the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": "'s soul harvesting. Taking a step up from ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dark_Crusade/",
              "runs": [
                {
                  "text": "Dark Crusade",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " the meta-map is fought across the entire system of Kaurava, which is 31 territories spread out across 4 planets and 3 moons.\n",
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
      "h": "Gameplay Changes",
      "level": 2,
      "anchor": "Gameplay_Changes",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Each of the original 7 races will gain new air units.. \n",
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
              "text": " The ",
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
              "text": " for the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ". \n",
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
              "text": " The ",
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
              "text": " for ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ". \n",
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
              "text": " The ",
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
              "text": " for the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ". \n",
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
              "text": " The ",
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
              "text": " for the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ". \n",
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
              "text": " The ",
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
              "text": " for the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ". \n",
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
              "text": " The ",
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
              "text": " for the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Tau/",
              "runs": [
                {
                  "text": "Tau Empire",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". \n",
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
              "text": " And the ",
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
              "text": " for the Necrons. The new air units all have a new armor type added to the game air_medium. The ",
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
              "text": " have been redesigned and are now a flying anti-air melee unit.\n",
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
              "text": "The rumor of new ground units for the other existing races (",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "originally seen in the game's code by viewing the UCS files",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": ") has been officially denied by IronLore. There is also a new introduction of a medal system for multiplayer. The latter would yield rewards once players met certain milestones such as, so many wins in a row, a 5-to-1 kill ratio, and so forth.\n",
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
      "h": "Interoperability with previous games",
      "level": 2,
      "anchor": "Interoperability_with_previous_games",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "In multiplayer gameplay,if you own ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dawn_of_War/",
              "runs": [
                {
                  "text": "Dawn of War",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", you will be able to use ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ", ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ", ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ", and ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ", If you own ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Winter_Assault/",
              "runs": [
                {
                  "text": "Winter Assault",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", you will be able to use the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": ", if you own ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dark_Crusade/",
              "runs": [
                {
                  "text": "Dark Crusade",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", you will be able to use the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": " and ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Necrons/",
              "runs": [
                {
                  "text": "Necron",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " races .\n",
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
      "h": "New Races",
      "level": 2,
      "anchor": "New_Races",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Initially, the ",
              "image": "",
              "alt": "",
              "link": ""
            },
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
            },
            {
              "text": " were announced as being included in the new expansion. However, it was announced in October 2007 that the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Sisters_of_Battle/",
              "runs": [
                {
                  "text": "Sisters of Battle",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " would be in as well.\n",
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
      "h": "Dark Eldar",
      "level": 3,
      "anchor": "Dark_Eldar",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "The Dark Eldar specialize in hit and run tactics, and collect the souls of their fallen enemies for use in their own purposes. The Dark Eldar are able to harvest souls from fallen opponents as a third resource which is used as a cost for \"Soul Effects\", large abilities and effects which are focused on the entire army or entire game map.\n",
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
      "h": "Sisters of Battle",
      "level": 3,
      "anchor": "Sisters_of_Battle",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "The Sisters of Battle are the Emperor's most fervent and devoted subjects. As like the Dark Eldar have \"Soul Effects\" the Sisters are driven by faith, which lets them call on the Immortal God-Emperor for \"Acts of the Faith,\" which are powerful abilities, allowing access to powerful offensive and defensive abilities.\n",
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
      "h": "Miscellaneous",
      "level": 2,
      "anchor": "Miscellaneous",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Soulstorm was released on March 5th, 2008 in the United States, Canada, Australia and Germany and March 7th for the United Kingdom and the rest of Europe.\n",
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
      "h": "See Also",
      "level": 2,
      "anchor": "See_Also",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "/settings/wiki/Dawn_of_War/",
              "runs": [
                {
                  "text": "Dawn of War",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
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
            },
            {
              "link": "/settings/wiki/Dawn_of_War_Winter_Assault/",
              "runs": [
                {
                  "text": "Dawn of War: Winter Assault",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
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
            },
            {
              "link": "/settings/wiki/Dawn_of_War_Dark_Crusade/",
              "runs": [
                {
                  "text": "Dawn of War: Dark Crusade",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
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
            },
            {
              "link": "/settings/wiki/Dawn_of_War_Players_Guide/",
              "runs": [
                {
                  "text": "Dawn of War: Player's Guide",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
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
      "h": "External Links",
      "level": 2,
      "anchor": "External_Links",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "http://www.dow-darkcrusade.com/",
              "runs": [
                {
                  "text": "Official Website",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
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
    }
  ],
  "image": "",
  "alt": "",
  "link": ""
};
