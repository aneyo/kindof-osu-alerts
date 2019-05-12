/*
  Disclaimer: I'm not very good at commenting
  so yeah, there's not that much code to read so I hope you'll forgive me
  also, code commenting is hard af for a non-native english speaker :(
*/

const DISPOSE_TIMEOUT = 10000, // Timeout for event items in milliseconds
  eventMessageFormat = event => {
    /* Message formatter for different type of events */
    switch (event.type) {
      case "follow":
        /* New follower event */
        return "New Follower: " + event.from; // => "New Follower: User"
      case "subscription":
        /* Subscribe event */
        return formatSubscription(event); // => (from formatSubscription()) "Subscription from User"
      case "donation":
        /* Donation event */
        return "Donation " + event.formattedAmount + " from " + event.from; // => "Donation $69 from User"
      case "host":
      case "raid":
        /* Host and Raid event, logically speaking they're all the same */
        return (
          event.type.charAt(0).toUpperCase() +
          event.type.slice(1) +
          " from " +
          event.from +
          " and " +
          (event.viewers || event.raiders) +
          " viewer(s)"
        ); // => "Host from User and 1 viewer(s)" or "Raid from User and 123 viewer(s)"
      case "bits":
        /* Bits donation event */
        return event.amount + " bit(s) from " + event.from; // => "500 bit(s) from User"
      case "merch":
        /* Merch buying event */
        return event.from + " bought a " + event.product; // => "User bought a T-Shirt"
      default:
        /* Unknown type of event */
        return event.from + ": " + event.tag; // => "User: event message(?)"
    }
  },
  formatSubscription = event => "Subscription from " + event.from; // TODO: resubs

let content, olds;

document.addEventListener("onLoad", () => {
  /* Creating main element, where all content will be */
  content = document.createElement("div");
  content.id = "alertu";

  /* Then creating the element for old messages */
  olds = document.createElement("div");
  olds.id = "old-ones";

  /* Appending everything */
  content.appendChild(olds);
  document.body.appendChild(content);
});

/* Listen for Events outside */
document.addEventListener("onEventReceived", event => {
  /* Get a first body child - it should be an our event item */
  let new_event_item = document.querySelector("body > .osu:first-child");

  /* Format and then add message to our event item */
  new_event_item.children.item(0).textContent = eventMessageFormat(
    event.detail
  );

  /* Append item to content block, so It sould be visible now */
  content.appendChild(new_event_item);
  /* Also add the type as a class name */
  new_event_item.classList.add(event.detail.type);

  /* Then we'll wait for moving/appearing animation to finish */
  new_event_item.addEventListener("animationend", animet => {
    if (animet.target.classList.contains("notification")) {
      /*
        We check for special attribute,
        we should ignore everything below if we have it already
      */
      if (!new_event_item.classList.contains("to-dispose")) {
        /* But if there's none - we'll add one */
        new_event_item.classList.add("to-dispose");

        /* And add the "removal" timeout */
        setTimeout(() => {
          /*
            When the time is out (haha) -
            we'll add a special class
            and then remove element after disappearing animation's end
          */
          new_event_item.classList.add("is-dying");
          new_event_item.addEventListener(
            "animationend",
            e => e.target.remove() /* yes, here */
          );
        }, DISPOSE_TIMEOUT);
      }
    }
  });

  /* When new element was added, older one should move to #old-ones block */
  let old;
  if ((old = document.querySelector("#alertu > .osu:not(:last-child)"))) {
    /* move it if we can */
    olds.appendChild(old);
    /* AND THEN SEARCH THROUGH ALL OLDER ONES */
    document.querySelectorAll("#old-ones > .osu").forEach(node => {
      /* force refresh trick to start sorting animation again */
      node.style.display = "none"; // hide item
      node.offsetHeight; // tell browser that we referenced one of layout values, that should do the trick
      node.style.display = null; // remove inline style
      /* node should redraw cause browser now thinks that we changed layout values */
    });
  }
});
