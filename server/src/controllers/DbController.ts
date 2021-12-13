import { Request, Response } from "express";
import db from "../database/connections";

export default class DbController {
  async dbSearch(request: Request, response: Response) {
    console.log("asddasd");
    const body = request.body;
    body.filtros = body.filtros.filter(function (obj: any) {
      for (var key in obj) {
        if (obj[key] === null || obj[key] === "") return false;
      }
      return true;
    });

    let query = await db
      .select("*")
      .from("character")
      .fullOuterJoin(
        "appear",
        "character.character_id",
        "appear.character_id_fk"
      )
      .fullOuterJoin(
        "location",
        "character.id_last_location",
        "location.location_id"
      )
      .fullOuterJoin("episode", "appear.episode_id_fk", "episode.episode_id")
      .where(function () {
        body.filtros.forEach((item: any) => {
          if (Object.keys(item).length !== 0) {
            if (item.comparator !== "like") {
              //@ts-ignore
              this.where(item.selection, item.comparator, item.constraint);
            } else {
              //@ts-ignore
              this.where(item.selection, "like", `%${item.constraint}%`);
            }
          }
        });
      })
      .distinct();

    return response.status(201).json({ return: query });
  }
}
