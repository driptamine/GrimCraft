// Auto-generated from https://warhammer-guide.ru/wiki/Dawn_of_War_Winter_Assault.html — do not edit by hand.
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
export const Dawn_of_War_Winter_AssaultArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Dawn of War Winter Assault",
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
              "link": "images/Winter_Assault_box.jpg",
              "runs": [
                {
                  "image": "images/250px-Winter_Assault_box.jpg",
                  "alt": "Winter Assault box.jpg",
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
              "link": "images/Winter_Assault_box.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Dawn of War: Winter Assault",
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " is an expansion pack for ",
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
              "text": " that was released in 2005.  Like Dawn of War, Winter Assault was developed by ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Relic_Entertainment/",
              "runs": [
                {
                  "text": "Relic Entertainment",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " and published by ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/THQ/",
              "runs": [
                {
                  "text": "THQ",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ".  Winter Assault is followed by ",
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
              "text": ", and is an official game for the ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "http://en.wikipedia.org/wiki/World_Cyber_Games",
              "runs": [
                {
                  "text": "World Cyber Games",
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
              "text": "Gameplay changes",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#Gameplay_changes",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Imperial Guard",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#Imperial_Guard",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "New units",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#New_units",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.1",
              "text": "Space Marines - Chaplain",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#Space_Marines_-_Chaplain",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.2",
              "text": "Chaos - Khorne Berzerkers",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#Chaos_-_Khorne_Berzerkers",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.3",
              "text": "Orks - Mega Armoured Nobz",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#Orks_-_Mega_Armoured_Nobz",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "3.4",
              "text": "Eldar - Fire Dragons",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#Eldar_-_Fire_Dragons",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "See Also",
              "href": "/settings/wiki/Dawn_of_War_Winter_Assault/#See_Also",
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
      "h": "Gameplay changes",
      "level": 2,
      "anchor": "Gameplay_changes",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Winter Assault has a number of gameplay changes that make the game more rewarding for users who favour longer, higher technology games.\n",
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
              "text": "Some examples;\n",
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
              "text": " Tier 1 units are not as effective at destroying bases or holding area's, with most units heavy weapon upgrades getting delayed until tier 2. Getting to tier 2 faster (for vehicles, heavy weapons) pushes people for longer games, although rushes are still possible.\n",
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
              "text": " To some peoples disapointment, Winter Assault employs a \"redundancy\" factor, where later tier units effectively replace earlier tier ones since they beat them on relative power to the units cost.\n",
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
              "text": " Technology research was streamlined (very much so for Orks who had in Dawn of War a lot of small upgrades), meaning to upgrade troops, you had fewer pieces of research available before you upgraded to the next Tier.\n",
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
              "text": " An additional Tier 4 where superunits are able to be created after a long period of research was added, where superunits were not as costly as Dawn of War, and much more effective at what they did. This is usually reached only in larger games with more players\n",
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
              "text": " Defensive structures were slightly improved and made cheaper over Dawn of War, and improved/made cheaper again in the 1.5 patch. This helped early game defenses.\n",
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
              "text": " Unit availability was altered, some units only being allowed in Tier 3 when before they were in Tier 2, and price alterations to match.\n",
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
              "text": " All builders were changed to take no population cap, meaning the higher tiers looked more favourable for massing effective high-pop-usage units.\n",
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
      "h": "Imperial Guard",
      "level": 2,
      "anchor": "Imperial_Guard",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "The ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "http://en.wikipedia.org/wiki/Imperial_Guard_(Warhammer_40,000)",
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
              "text": " are a new race in Dawn of War: Winter Assault.  While individual IG infantry units are quite weak, they find strength in numbers, strong defensive buildings, and powerful vehicles.\n",
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
      "h": "New units",
      "level": 2,
      "anchor": "New_units",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "The Winter Assault expansion features one new unit for each of the races from Dawn of War.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " Space Marines - ",
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
              "text": " ",
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
              "text": "The Chaplain wields a power mace (Crozius Arcanum) in close combat, gives off a powerful healing aura, and has a special ability that destroys enemy morale and slows their advance.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " Chaos - ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Khorne_Berzerker_Squad/",
              "runs": [
                {
                  "text": "Khorne Berzerkers",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " ",
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
              "text": "Khorne Berzerkers are a strong and fast close combat assault squad armed with bolt pistol and chainaxe. They have no morale and are, therefore, fearless.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " Orks - ",
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
              "text": " ",
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
              "text": "Mega-Armored Nobz are slow but very powerful. In a squad of four they are very hard to stop as they have armour similar to that of a Warboss. In order to move faster, they shock themselves in electricity that doubles their speed but also damages them.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " Eldar - ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Fire_Dragon/",
              "runs": [
                {
                  "text": "Fire Dragons",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " ",
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
              "text": "Fire Dragons wield fusion guns which are short ranged guns very powerful against vehicles and buildings. However, they are weak against infantry.\n",
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
              "link": "/settings/wiki/Dawn_of_War_Soulstorm/",
              "runs": [
                {
                  "text": "Dawn of War: Soulstorm",
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
              "text": " ",
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
    }
  ],
  "image": "",
  "alt": "",
  "link": ""
};
