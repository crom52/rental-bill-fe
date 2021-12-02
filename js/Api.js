//
//

const Api = (() => {
  const context = `https://rental-payment-backend.herokuapp.com/`;
  const context2 = `http://localhost:8080`;

  async function getCurrentBill(roomId, year, month) {
    let rs;
    await axios
      .get(`${context}/bill/${roomId}/${year}/${month}/current-month`)
      .then(
        (response) => {
          rs = response;
        },
        (error) => {
          console.log(error);
        }
      );
    return rs;
  }

  async function getPrevBill(roomId, year, month) {
    let rs;
    await axios
      .get(`${context}/bill/${roomId}/${year}/${month}/prev-month`)
      .then(
        (response) => {
          rs = response;
        },
        (error) => {
          console.log(error);
        }
      );
    return rs;
  }

  async function saveBill(params) {
    let rs;
    await axios
      .post(
        `${context}/bill/${params.roomId}/${params.year}/${params.month}/update`,
        params
      )
      .then(
        (response) => {
          rs = response;
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
    return rs;
  }

  return {
    getCurrentBill,
    getPrevBill,
    saveBill,
  };
})();
