// Auto-generated from https://warhammer-guide.ru/wiki/Dawn_of_War_Dark_Crusade.html — do not edit by hand.
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
export const Dawn_of_War_Dark_CrusadeArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Dawn of War Dark Crusade",
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
              "text": "You may be looking for ",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Dark_Crusade_units_list/",
              "runs": [
                {
                  "text": "Dark Crusade units list",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": "...",
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
              "text": "Dawn of War: Dark Crusade",
              "italic": true,
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " is a recently released second expansion to ",
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
              "text": " by ",
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
              "text": " and ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Relic/",
              "runs": [
                {
                  "text": "Relic",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ". The expansion features an all new single-player experience and 2 new races- the Necrons and the Tau. Relic aims to make 'the greatest expansion pack ever made' according to one company representative.\n",
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
              "link": "images/Dowcomingsoon.jpg",
              "runs": [
                {
                  "image": "images/Dowcomingsoon.jpg",
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
              "link": "images/Dowcomingsoon.jpg",
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
              "text": "Dark Crusade logo",
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
              "link": "images/DOW_DC_cover_art.jpg",
              "runs": [
                {
                  "image": "images/180px-DOW_DC_cover_art.jpg",
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
              "link": "images/DOW_DC_cover_art.jpg",
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
              "text": "Dark Crusade box art",
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
              "link": "images/DC_logo2.jpg",
              "runs": [
                {
                  "image": "images/180px-DC_logo2.jpg",
                  "alt": "DC logo2.jpg",
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
              "link": "images/DC_logo2.jpg",
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
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#New_features",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Gameplay Changes",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#Gameplay_Changes",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Interoperability with other games",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#Interoperability_with_other_games",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "New Races",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#New_Races",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.1",
              "text": "Necrons",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#Necrons",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 1,
              "n": "4.2",
              "text": "Tau",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#Tau",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "5",
              "text": "Miscellaneous",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#Miscellaneous",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "6",
              "text": "See Also",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#See_Also",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "7",
              "text": "External Links",
              "href": "/settings/wiki/Dawn_of_War_Dark_Crusade/#External_Links",
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
              "text": "It features a new campaign including a new \"meta map\", similar to that in Dune. It also introduces a new option in which commanders can be customized in the campaign - Wargear. It has been said by ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Tranj/",
              "runs": [
                {
                  "text": "Tranj",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " that there will be ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "http://forums.relicnews.com/showthread.php?p=1426301#post1426301",
              "runs": [
                {
                  "text": "no new units for the existing races",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ", but ",
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
              "text": " were spotted in released screenshots.  The addition of one new unit to each existing race was confirmed on ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "7_August&action=edit&redlink=1.html",
              "runs": [
                {
                  "text": "7 August",
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
              "link": "/settings/wiki/2006/",
              "runs": [
                {
                  "text": "2006",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": ".  They are the ",
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
              "text": " ",
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
              "text": ", ",
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
              "text": " ",
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
              "text": ", the ",
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
              "text": " ",
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
              "text": ", the ",
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
              "text": " ",
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
              "text": ", and the ",
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
              "text": " ",
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
              "text": " Stealth units can attack and cap while in stealth mode\n",
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
              "text": " Singleplayer commanders can be upgraded between battles, making them much more powerful (This does not occur in multiplayer, but upgrades as per usual will upgrade heroes).\n",
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
              "text": " The Necron's monolith, starting as a building, will be able to turn into a slow moving, but teleport capable unit.\n",
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
              "link": "http://en.wikipedia.org/wiki/Risk_(game)",
              "runs": [
                {
                  "text": "Risk",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " style \"meta-map\" in which a player attacks a territory with his army with the goal of taking over the map, while each territory has its own unique units and upgrades as a reward when captured by a player.\n",
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
              "text": " Each of the original 5 races (Including the Imperial Guard with WA) will gain a new unit, Grey Knights for the Space Marines, Flash Gitz for the Orks, Heavy Weapon Teams for the Imperial Guard, Daemon Prince for Chaos and Harlequins for the Eldar\n",
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
      "h": "Interoperability with other games",
      "level": 2,
      "anchor": "Interoperability_with_other_games",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Dark Crusade can be played without Dawn of War or Winter Assault; having the previous games unlocks the races those games introduced in multi-player.  Having ",
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
              "text": " installed and inputting its CD-Key allows use of the ",
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
              "text": ", ",
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
              "text": " and ",
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
              "text": " in Dark Crusade's multi-player; having ",
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
              "text": " installed and inputting its CD-Key allows use of the ",
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
              "text": ".  There is a ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "http://forums.relicnews.com/showthread.php?t=140580",
              "runs": [
                {
                  "text": "trick",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " available to unlock the races without installing the full games by copying the executables and editing the registry.  Players of Dawn of War and Winter Assault cannot connect to a player using Dark Crusade as the two games are not directly compatible, unlike ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Company_of_Heroes/",
              "runs": [
                {
                  "text": "Company of Heroes",
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
              "link": "/settings/wiki/Soulstorm/",
              "runs": [
                {
                  "text": "Soulstorm",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " follows the same format as Dark Crusade did.\n",
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
              "text": "All new and previous races are available in single-player skirmish or the meta-map campaign.\n",
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
              "text": "'s marketing strategy meant that ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "http://en.wikipedia.org/wiki/Tau_(Warhammer_40,000)",
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
              "text": " were revealed as one of the races in the new ",
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
              "text": " expansion rather early. Necrons were revealed later but still ahead of the scheduled time. It has been suggested that if the Necrons were revealed first then it could have prolonged the tension that ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "/settings/wiki/Tranj/",
              "runs": [
                {
                  "text": "Tranj",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " worked so hard to build.\n",
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
      "h": "Necrons",
      "level": 3,
      "anchor": "Necrons",
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
              "link": "http://en.wikipedia.org/wiki/Necron",
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
            },
            {
              "text": " economy relies on power. Strategic points are needed as they will be the source of speeding production and upgrade times.\n",
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
              "text": "The Monolith is the only unit-producing structure that the Necrons have, so Necron players will have to choose at an early stage whether to build up an army or build up to a monolith, inferring an expensive system. The Necrons are possibly the most unique of all of the existing races.\n",
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
      "h": "Tau",
      "level": 3,
      "anchor": "Tau",
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
              "link": "http://en.wikipedia.org/wiki/Tau(Warhammer_40,000)",
              "runs": [
                {
                  "text": " Tau",
                  "image": "",
                  "alt": "",
                  "link": ""
                }
              ],
              "image": "",
              "alt": ""
            },
            {
              "text": " have been welcomed with slightly less enthusiasm, this may well be due to the fact that they  are not as radical as the Necron structure. Their army may look as standard as the others, but they have advanced technology and their weapons of choice are ranged. In addition, they also have alien auxiliaries in the form of Kroot and Vespids. \n",
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
              "text": "Dark Crusade was released in October of 2006.\n",
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
