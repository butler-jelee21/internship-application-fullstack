addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond a random variant from base url
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = "https://cfw-takehome.developers.workers.dev/api/variants";
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let variants = data.variants;   // hold url variants
      let randUrl = getRandom(variants)   // get random url
      // then fetch the random variant
      const getVariant = fetch(randUrl).then((response) => {return response;});
      return getVariant;
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    console.log("Response:", response);
    return response;
  // return new Response(response, {
  //   headers: { 'content-type': 'text/plain' },
  // })
}

function getRandom(array) {
  return array[Math.floor(Math.random() * Math.floor(array.length) % array.length)];
}