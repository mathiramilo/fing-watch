import pymongo


def get_movie(client: pymongo.MongoClient, tmdb_id: int):
    col = client.get_database("data").get_collection("movies")
    result = col.find_one({"tmdb_id": tmdb_id})

    if result:
        # remove mongodb _id field
        result.pop("_id")
        return result
    else:
        raise Exception("Movie not found.")


def get_movies(client: pymongo.MongoClient, movies_ids):
    # get movies json from mongo
    return [get_movie(client, int(tmdb_id)) for tmdb_id in movies_ids]
