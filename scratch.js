//import {FusionAuthClient} from 'FusionAuthClient'




var {FusionAuthClient} = require("@fusionauth/typescript-client");
const client = new FusionAuthClient(
  "ob2iLyOMN8lZGfNUSpH79kK66pzcz4onMcNHKIEc-zUf9UtRXVqj8Obb",
  "http://localhost:9011"
);

client
  .retrieveUserByEmail("bradley+twitter@indri.co.za")
  .then((clientResponse) => {
    console.log("User:", JSON.stringify(clientResponse.response.user, null, 2));
  })
  .catch((err) => {
    console.error(err);
  });
