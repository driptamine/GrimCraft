// Auto-generated from https://warhammer-guide.ru/wiki/Dawn_of_War.html — do not edit by hand.
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
export const Dawn_of_WarArticle: { title: string; subtitle: string; sections: WikiSection[] } = {
  "title": "Dawn of War",
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
              "link": "images/Dawn_of_War_box.jpg",
              "runs": [
                {
                  "image": "images/250px-Dawn_of_War_box.jpg",
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
              "link": "images/Dawn_of_War_box.jpg",
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
              "text": "Dawn of War cover",
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
              "text": "Warhammer 40,000: Dawn of War",
              "italic": true,
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " is a Real Time Strategy game for the PC developed by ",
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
              "text": ". Based on Games Workshop's popular tabletop wargame, Warhammer 40,000, ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " was released in September 2004.\n",
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
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " features four armies:\n",
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
              "text": "Space Marines, in particular the Blood Ravens\n",
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
              "text": "Orks\n",
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
              "text": "Eldar\n",
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
              "text": "Chaos Space Marines or simply, Chaos\n",
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
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " introduces the Blood Ravens, an original chapter of Space Marines created by Relic. The Blood Ravens' history, organization, and other background information about them are described in the White Dwarf magazine (White Dwarf, 2004) as well as the novel ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " (Goto, 2004).\n",
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
              "text": "The Single Player campaign deals with the Blood Ravens 3rd Company as they are called to assist against an Ork invasion on the planet Tartarus. This eventually pulls them into conflict with the Eldar and finally the forces of Chaos. \n",
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
              "text": "As of August ",
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
              "text": ", Dawn of War had sold in excess of 1.5 million copies.",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "link": "http://forums.relicnews.com/showpost.php?p=1643540&postcount=31",
              "runs": [
                {
                  "text": "[1]",
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
        },
        {
          "block": "toc",
          "items": [
            {
              "level": 0,
              "n": "1",
              "text": "Notable features",
              "href": "/settings/wiki/Dawn_of_War/#Notable_features",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "2",
              "text": "Gameplay",
              "href": "/settings/wiki/Dawn_of_War/#Gameplay",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "3",
              "text": "Criticism",
              "href": "/settings/wiki/Dawn_of_War/#Criticism",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "4",
              "text": "Expansions",
              "href": "/settings/wiki/Dawn_of_War/#Expansions",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "5",
              "text": "Novels",
              "href": "/settings/wiki/Dawn_of_War/#Novels",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "6",
              "text": "Miscellaneous",
              "href": "/settings/wiki/Dawn_of_War/#Miscellaneous",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "7",
              "text": "External links",
              "href": "/settings/wiki/Dawn_of_War/#External_links",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "level": 0,
              "n": "8",
              "text": "See also",
              "href": "/settings/wiki/Dawn_of_War/#See_also",
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
      "h": "Notable features",
      "level": 2,
      "anchor": "Notable_features",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "images/Dawn_of_War_logo.jpg",
              "runs": [
                {
                  "image": "images/Dawn_of_War_logo.jpg",
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
          "block": "p",
          "runs": [
            {
              "text": "Dawn of War has very different gameplay than most modern RTS games, because of its squad-based units, close combat options, morale, and point-based resourcing system, which had been featured to some point in certain games (such as Sid Meier's Civil War, which included both morale and large groups of units) but was absent from most games produced as of 2000.\n",
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
              "text": " The squad system is innovative and had never really been explored in other modern RTS games, though some older RTSes had a system that was comparable. Squads can be reinforced by adding additional members, equipped with additional special weaponry, attached leaders or special units, also mostly unexplored in modern RTSes. For example, a Space Marine squad starts with 4 marines, but can be expanded up to 8 standard marines(9 in the single player campaign mode) and a sergeant, and equipped with up to 4 (with an upgrade, otherwise two) heavy weapons: Heavy Bolters, Plasma Guns, Flamers or Missile Launchers, each of which has their own characteristics. It is also possible to attach a hero or a special unit to the squad. The ability to reinforce even during battle creates interesting situations with armies being reinforced on the spot rather than new units being made in a player's base. The winner can usually expect little defense if he defeats the enemy army completely, since base fortifications are not as prominent as in most other RTS games.\n",
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
              "text": " The close combat units differ from other contemporary and modern RTS games as well. While the idea of close combat units dates back to ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Warcraft",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": ", one of the first \"modern\" real-time-strategy games, ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " implements it more realistically. Many units have both ranged weapons and melee weapons rather than strictly one or the other, as is the case in most other modern strategy games. Any ranged unit engaged in close combat cannot fire and must engage its attacker in close combat in return. This makes tying-up enemy ranged squads with melee attacks, preventing them from firing, a tactical option and often a priority. Some units are better at melee attacks or ranged attacks than others.  In addition, when a unit is defeated in close combat, the victorious unit will kill it off a special (and often bloody) finishing move - such as (in the case of a space marine to a space marine) unleashing a flurry of strikes on a stunned opponent before stabbing the blade through their heart. Units are invulnerable to damage while in their killing animations, which some players use to their advantage if the unit is taking fire while in combat; this is sometimes seen as a bug, although it should be noted that the invulnerable unit is also incapable of doing any damage to its attackers whilst engaged in the sync-kill.\n",
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
              "text": " An addition to the typical hitpoint system is morale (which is, again, mostly deficient in modern RTSes). While units in a squad take damage individually, morale damage is applied to a squad as a whole. When morale drops to zero the squad breaks and its combat ability is greatly reduced. The player retains control of the unit and may decide whether to retreat and regain morale or stay and fight. Different weapons deal different amounts of damage to health and morale.\n",
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
              "text": " The game uses two kinds of resources: \"requisition\" and \"power\". Requisition is generated by the army headquarters and by controlling certain points on the battlefield. Only infantry can capture these points and it takes a certain amount of time for them to do so. Points can be de-captured and then captured by the enemy. There are three kinds of points:\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Strategic Points",
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " are most common, quick to capture, and have an average line of sight. After capturing, a listening post may be built on them to protect them from de-capture; this also increases the amount of requisition generated. The listening post can be upgraded with defenses, which also further increases amount of requisition generated. Certain games can be won by a player holding two-thirds of map's Strategic Points for 7 minutes.\n",
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
              "text": "Critical Locations",
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " are always in uneven amount on the map. These take longer to capture and have a bigger line of sight, but cannot have listening posts built on them, thus making them harder to hold. They are usually located at \"choke points\", and certain games can be won by a player or team holding half the critical locations on the map for 8 minutes.\n",
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
              "text": "Relics",
              "bold": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " take the longest to capture and have a small line of sight. However, holding a relic gives access to the race's most advanced and powerful units. Relics can have listening posts built on them.\n",
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
              "text": "The power resource can be generated by building plasma generators: up to six generators can be built per headquarter. Additionally, some maps have special points called \"slag deposits\", at which special generators can be constructed. These are more expensive but produce power at much higher rate, as well as allowing buildings to be built nearby. As the player progresses up the tech tree reliance on power increases.\n",
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
              "text": "Other features include heroes, 4 completely different races, and clear distinction between infantry and vehicles, with vehicles being almost impervious to the attacks of non-upgraded infantry units, while being able to destroy many of them themselves. The engine allows for full 3D camera movement.\n",
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
      "h": "Gameplay",
      "level": 2,
      "anchor": "Gameplay",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "With the addition of a squad system and more realistic ranged-close combat dynamics (see above section), Dawn of War is different to the majority of strategy games. Troops have morale, which, when drained completely, causes the squad to \"break\" and scatter, severely decreasing firepower but granting a movement bonus. Squads can be reinforced on the spot rather than forcing the player to create new units at their base. The game contains many breaks from the norm of the genre, and introduced several new concepts.\n",
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
              "text": "The game is, overall, very micromanagement-oriented. With the reinforcement system, extra armament for troopers, and special skills, the player is often forced to switch back and forth between different squads and vehicles quickly, making fast decisions to keep their combat effectiveness. The strategic-point system favors aggressive gameplay; early in the game, skirmishes and battles within the first few minutes are common. The extra gameplay dynamics open up many new options for players - such as the strategy of sending in several well equipped squads against a stronger enemy force and reinforcing them as they lose their numbers, prolonging the life of the squad hopefully long enough for them to accomplish their objective (usually defense of an area until reinforcements can arrive).\n",
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
              "text": "Infantry units in the game more accurately reflect actual warfare; each individual squad is made up of many troopers, which act independently as individuals yet fight and move as a group. If a missile blast hits the squad, the troopers are blown away. If they survive, they get to their feet and resume firing from their position, leaving the squad scattered, as it likely would be in real life. The player could order the squad to move, thereby regrouping them, or leave them as they are, which might put them at a disadvantage, or indeed, in rare cases, an advantage (against artillery barrages, for instance). Troopers fire as they move rather than being forced to stop before they fire (though this is still the case with some heavy weaponry), unlike many other strategy games. When the squad is broken and ordered to retreat, the squad tends to act less cohesively, with troopers straying from the group easier and not moving as tightly, actively reflecting their panicked and demoralized state.\n",
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
              "text": "The scope of the squad mechanics means that strategy plays an even bigger part in the game, especially with infantry warfare. Holding of strategic avenues (not necessarily Strategic Points), such as those with valuable heavy cover near a bottleneck leading to a player's base with Infantry becomes a worthwhile task, unlike in others, where the strategic value of a location without a building or resource on it is usually next to nil and not worth defending.\n",
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
              "text": "In other strategy games, retreat and \"pulling one's losses\" are not viable because unless the infantry is retreating to a place where it can find more units to help fight or take shelter in turrets or buildings, the squad will fight as well in any other location as it does at the point it is already fighting, thereby making strategic retreat and widthdrawal little-used and not useful tactics. In Dawn of War, however, with the added scope of squad-based infantry combat and reinforcements, widthdrawing a squad can allow it to replenish and regain its morale at the next set of fortifications or the player's base, allowing it to perhaps drive off its attackers once they attack again - this is mostly unique in the field of Real-time strategy.\n",
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
      "h": "Criticism",
      "level": 2,
      "anchor": "Criticism",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " was mainly criticized for its short and repetitive single player campaign. All missions are fairly similar in both objectives and execution of therein, with few exceptions. Also, despite several patches, some fans still consider the game to be unbalanced in multiplayer.\n",
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
      "h": "Expansions",
      "level": 2,
      "anchor": "Expansions",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "See these pages for more detail:\n",
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
              "text": " ",
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
              "text": " ",
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
      "h": "Novels",
      "level": 2,
      "anchor": "Novels",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "text": "In December 2004, Black Library released a novelization of ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " (Goto, 2004). The story expands on the story found in the Single Player campaign, with additional characters and in more detail.  A follow-up novel, ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War: Ascension",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " (Goto, 2005) was released in November 2005, continuing the story of Captain Angelos and the Blood Ravens. A third book titled ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War: Tempest",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": ", again by Cassern Goto, is projected to be published sometime in October 2006; deviating from the plotline of the first two books, it will tell the story of Blood Ravens Librarian Rhamah and his struggle to save his chapter's gene-seed in the Eye of Terror.\n",
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
              "text": " ",
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " has an active modding community. Relic Entertainment released official modding tools for the community to use.\n",
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
              "text": "Dawn of War",
              "italic": true,
              "image": "",
              "alt": "",
              "link": ""
            },
            {
              "text": " is also the name of a cancelled Real Time Strategy game set in prehistoric times by SouthPeak Interactive.\n",
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
      "h": "External links",
      "level": 2,
      "anchor": "External_links",
      "blocks": [
        {
          "block": "p",
          "runs": [
            {
              "link": "http://www.dawnofwargame.com/",
              "runs": [
                {
                  "text": "Official ",
                  "image": "",
                  "alt": "",
                  "link": ""
                },
                {
                  "text": "Dawn of War",
                  "italic": true,
                  "image": "",
                  "alt": "",
                  "link": ""
                },
                {
                  "text": " Website",
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
              "link": "http://forums.relicnews.com/forumdisplay.php?f=90",
              "runs": [
                {
                  "text": "RelicNews Community ",
                  "image": "",
                  "alt": "",
                  "link": ""
                },
                {
                  "text": "Dawn of War",
                  "italic": true,
                  "image": "",
                  "alt": "",
                  "link": ""
                },
                {
                  "text": " Forums",
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
              "link": "http://forums.relicnews.com/forumdisplay.php?f=96",
              "runs": [
                {
                  "text": "RelicNews Community Dawn of War Modding Forums",
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
              "link": "http://games.moddb.com/100/Dawn-of-War/",
              "runs": [
                {
                  "text": "Dawn of War Mods and Tutorials",
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
              "link": "http://www.mobygames.com/game/windows/warhammer-40000-dawn-of-war",
              "runs": [
                {
                  "text": "Warhammer 40,000: Dawn of War at MobyGames",
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
              "link": "http://www.warhammmer.sztab.com/",
              "runs": [
                {
                  "text": "Warhammer 40,000 Polish Site",
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
              "link": "http://wh40k.gram.pl/",
              "runs": [
                {
                  "text": "Polish Official Website",
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
      "h": "See also",
      "level": 2,
      "anchor": "See_also",
      "blocks": [
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
              "text": " ",
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
              "text": " ",
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
