addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

let tracker = null;
let restart = true;
const baseUrl = "https://cfw-takehome.developers.workers.dev/api/variants";

class ElementHandler {

  element(element) {
    const attribute = element.getAttribute('id');
    // variant 1 => Linkedin
    // variant 2 => Github
    if (tracker == 1) {
      if (attribute == 'title') {
      element.setInnerContent('Jesse\'s GitHub');
      }
      if (element.tagName == 'title') {
        element.setInnerContent('Jesse\'s GitHub');
      }
      if (attribute == 'description') {
        element.setInnerContent('This is displaying Jesse\'s GitHub!');
      }
      if (attribute == 'url') {
        element.setInnerContent('Go to Jesse\'s GitHub!');
      }
      if (element.getAttribute('href')) {
        element.setAttribute('href', 'https://github.com/butler-jelee21');
      }
    }
    else {
      if (attribute == 'title') {
      element.setInnerContent('Jesse\'s LinkedIn');
      }
      if (element.tagName == 'title') {
        element.setInnerContent('Jesse\'s LinkedIn');
      }
      if (attribute == 'description') {
        element.setInnerContent('This is displaying Jesse\'s LinkedIn!');
      }
      if (attribute == 'url') {
        element.setInnerContent('Go to Jesse\'s LinkedIn!');
      }
      if (element.getAttribute('href')) {
        element.setAttribute('href', 'https://www.linkedin.com/in/jesselee615/');
      }

    }
  }
}

const rewriter = new HTMLRewriter()
  .on('h1#title', new ElementHandler())
  .on('title', new ElementHandler())
  .on('p#description', new ElementHandler())
  .on('a#url', new ElementHandler());

/**
 * Respond a random variant from base url if no cookies
 * if there is cookie, respond with appropriate url
 * @param {Request} request
 * 
 * Sources Used:
 * https://developers.cloudflare.com/workers/templates/pages/ab_testing/
 */
async function handleRequest(request) {
  const NAME = 'variant';
  const cookie = request.headers.get('cookie');
  console.log('Cookie received:', cookie);
  let variant = null;
  // get the list of variants
  let response = await fetch(baseUrl).then((response) => response.json());
  // store the variants for later access
  let variants = response.variants;

  // preprocess the responses of the two variants in the case that there is a cookie
  let v1 = await fetch(variants[0]).then((response) => response.body);
  let v2 = await fetch(variants[1]).then((response) => response.body);
  const VARIANT_ONE = new Response(v1);
  const VARIANT_TWO = new Response(v2);

  // if there is a cookie and the cookie is the first variant, return VARIANT_ONE
  if (!restart && cookie && cookie.includes(`${NAME}=${variants[0]}`)) {
    return rewriter.transform(VARIANT_ONE);
  }
  // if there is a cookie and the cookie is the second variant, return VARIANT_TWO
  else if (!restart && cookie && cookie.includes(`${NAME}=${variants[1]}`)) {
    return rewriter.transform(VARIANT_TWO);
  }
  // otherwise, pick a random variant with probability of 0.5 and set the cookie with the variant chosen
  else {
    restart = false;
    let randUrl = getRandom(variants);
    let idx = variants.indexOf(randUrl);
    tracker = idx;
    let randVariant = fetch(randUrl)
      .then((response) => {
        let tmpResponse = new Response(response.body);
        tmpResponse.headers.append('Set-Cookie', `${NAME}=${variants[idx]}`);
        return rewriter.transform(tmpResponse);
      });
    return randVariant;
  }
}

function getRandom(array) {
  let idx = Math.random() < 0.5 ? 0 : 1;
  return array[idx];
}

