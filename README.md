[![FingWatch Demo]          // Title
([https://www.youtube.com/watch?v=Hc79sDi3f0U](https://www.youtube.com/watch?v=oYsGTYXDveQ) "FingWatch Demo")    // Video Link

## 1. Problem

The world of cinematic entertainment offers an immense array of options, which can be overwhelming for movie enthusiasts seeking films that suit their personal tastes. Moreover, the lack of guidance often leads to an unsatisfactory viewing experience, where users may waste time and money on movies that don't truly interest them.

The overabundance of films, genres, actors, and directors, coupled with the absence of an effective recommendation system, is a challenge faced by both casual and passionate cinephiles. Additionally, traditional recommendation algorithms often struggle to comprehend the ever-changing and unique preferences of each user, limiting their ability to provide accurate and personalized recommendations.

## 2. Our Solution

Our solution is a web-based movie recommendation application that employs a personalized approach to help users discover films they truly enjoy. Here are the key aspects of our solution:

1. **Recommendation System:** Based on user preferences, we recognize the need to create a recommendation system that relies on popular and recent movies. In addition to offering content-based recommendations, we incorporate user-based and history-based recommendations. This enables us to generate precise and personalized recommendations for our users.
   
2. **Updated Database:** A fundamental goal is to develop a mechanism that provides real-time information about new releases. This ensures the continuous updating of our database with the latest movies.

3. **Real-Time Updates:** Our platform collects user feedback, allowing users to modify this feedback at any time through their favorites list. This enables us to continuously adapt our recommendations as user preferences evolve.

4. **Content Exploration:** In addition to personalized recommendations, we provide users with the ability to explore movies either by genre or by similarities with a specific film.

5. **Platform Availability:** Along with movie information, our platform will show users on which streaming platforms the movie is available for viewing.

6. **Error Tolerance:** When searching for a specific movie, a certain level of error tolerance will be accepted to enhance the search experience.

## 3. Architecture

![fing-watch-architecture](https://github.com/mathiramilo/fing-watch/assets/42822912/8202df8d-c13c-4912-8c8f-42662806d952)

For the deployment of this system, we primarily utilize Docker technology along with hosting services provided by the Antel Elastic Cloud. This configuration allows the end user to access various platform services through an Nginx server.

**3.1 TMDB API**
Primarily, we leverage the TMDB API to access metadata used for movies. One advantage of this API is its provision of basic movie information, along with details about the platforms where the movies are currently available. Additionally, TMDB allows us to obtain keywords associated with a particular movie, which will be useful later (3.4).

**3.2 Scrapping**
We have a scraping service running in a Docker container, interacting with the TMDB API to fetch movie posters and specific fields of interest. This service operates continuously, allowing us to consume movies as they are added to the TMDB API. Key fields of interest include:
- adult: bool
- genres: []String
- id: String
- keywords: []String
- original language: String
- overview: String
- release date: String
- runtime: u32
- status: String
- title: String
- vote average: f64
- providers: []String

**Null Values Issue**
We encounter the challenge that not all movies returned by the API contain the expected fields. Therefore, a decision was made to discard movies that cannot be deserialized using the proposed schema.

**3.3 Typesense**
As movies are processed by the scraping service, they are added to a "movies" collection within the Typesense search engine. This enables queries on the "movies" collection with a certain tolerance for typographical errors. We can also assign weights to different fields during searches, delivering results to the end user in an order based on the matching score of the conducted query. For example, when querying 'Hary Poter,' the desired results are expected to be displayed as shown in Figure 2. Notably, aside from containing typographical errors, it is not necessary to specify the complete movie title for the result 'Harry Potter and the Philosopher's Stone' to be shown.

**Long-Term Improvements**
It's worth noting that Typesense offers various services beyond those mentioned earlier, which can be valuable in future platform updates.

**3.4 Gorse**
As movies are processed by the scraping service, they are also added to the Gorse recommendation system. The only fields used at this point are 'id' for movie identification and 'keywords,' which are used to "describe" the movie's characteristics within the recommendation system. For example, the movie "Harry Potter and the Philosopher's Stone" contains keywords such as "witch," "school friend," "friendship," and more.

With these fields, Gorse can retrieve movies that are "similar" to a certain movie, as shown in Figure 3. It can also generate recommendations for users, whether they are 'Content Based,' 'Collaborative Filtering,' or 'User Based,' as illustrated in Figure 1. Collaborative Filtering is based on user feedback history, while User Based relies on user characteristics (e.g., current location or age).

Furthermore, Gorse offers extensive configuration options, such as adding a Time-To-Live (TTL) field for user feedback.

**3.5 Media**
A 'images' volume is used to store images (posters and banners) of processed movies. These images are then accessed by the client through a web server that provides access to this volume. As of November 21, 2023, this volume has 9.26GB corresponding to 11,219 processed movies and continues to grow.

## 4. Future Work

As mentioned in the document, many of the tools used have a wide range of functionalities that could be useful in future updates to the platform. For instance, when retrieving data from the TMDB API, we could inquire about the cast of the movie. This would allow us to add this field when conducting searches. Additionally, the search system could be refined by incorporating an intuitive filtering system for the user.

Another important aspect we believe should be added in the future is transparency in the recommendations provided. Users should be given information on how recommendations are generated and how the algorithms used by the platform function. This way, transparency and confidence in the operation and real use of the data contributed by users are provided.

Last but not least, we think that social integration could be a significant enhancement to the platform by introducing features that enable users to share their favorite lists and recommendations with friends. Additionally, a commenting system could be implemented to foster interaction among users.

## 5. Conclusion

The development of the "ngwatch" platform was highly enriching, as we successfully achieved the initially set objectives. Throughout the process, we explored and applied a variety of interesting technologies, with notable highlights being the Typesense search engine and the Gorse recommendation system. These tools not only allowed us to effectively implement the concepts learned throughout the course but also significantly enriched our understanding and vision of the topics covered in the course.
