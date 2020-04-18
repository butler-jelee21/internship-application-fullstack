addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

let tracker = 0;

// TODO: rename html rewriter classes
class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName;
  }

  element(element) {
    const attribute = element.getAttribute('id');
    // variant 1 => Linkedin
    // variant 2 => Github
    if (tracker) {
      // console.log(`tracker is ${tracker}`);
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
        console.log('reach')
        element.setInnerContent('Go to Jesse\'s GitHub!');
      }
      if (element.getAttribute('href')) {
        element.setAttribute('href', 'https://github.com/butler-jelee21');
      }
    }
    else {
      // console.log(`tracker is ${tracker}`);
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
        console.log('reach')
        element.setInnerContent('Go to Jesse\'s LinkedIn!');
      }
      if (element.getAttribute('href')) {
        element.setAttribute('href', 'https://www.linkedin.com/in/jesselee615/');
      }

    }
  }
}

const rewriter = new HTMLRewriter()
  .on('h1', new AttributeRewriter('title'))
  .on('title', new AttributeRewriter('title'))
  .on('p', new AttributeRewriter('title'))
  .on('a', new AttributeRewriter('title'));

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
        let randUrl = getRandom(variants);   // get random url
        // then fetch the random variant
        const getRandomResponse = fetch(randUrl)
          .then((response) => {
            return response;
          });
        return getRandomResponse;
      })
    .catch((error) => {
      console.error('Error:', error);
    });
    console.log(tracker);
    return rewriter.transform(response);
}

function getRandom(array) {
  let idx = Math.floor(Math.random() * Math.floor(array.length) % array.length);
  tracker = idx;
  return array[idx];
}

