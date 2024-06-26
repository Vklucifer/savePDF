const express = require('express');
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const b64ab = require('base64-arraybuffer')


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/api', (req, res) => {
    const requestData = JSON.parse(req.body.html);
    console.log("userData: ", requestData)
    createPDF(getInvoiceTemplate(requestData)).then((b64)=>{
        res.status(200).json({ base64: b64 });
    })
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

async function createPDF(htmlContent) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return b64ab.encode(pdfBuffer)

    } catch (error) {
        console.error('Error generating PDF:', error);
    }
}


function getInvoiceTemplate(data) {
    return `
      <html lang="en">
      <head>
          <style>
              * {
                  margin: 0;
                  padding: 0;
              }
  
              .parentContainer {
                  padding: 0 2vw;
  
                  .childContainer {
                      .header {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
  
                          margin: 40px 0;
  
                          svg {
                              height: 50px;
                              width: auto;
                          }
  
                          div {
                              display: inherit;
                              flex-direction: column;
                              align-items: end;
  
                              h2 {
                                  font-size: 20px;
                              }
  
                              p {
                                  font-size: 15px;
                              }
                          }
                      }
  
                      .invoiceNumber {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
  
                          margin: 30px 0;
  
                          p {
                              font-size: 18px;
                          }
                      }
  
                      .bookingDetailBox {
                          margin-bottom: 30px;
  
                          .guestBookingDetails {
                              display: flex;
                              justify-content: space-between;
  
                              margin: 30px 0;
  
                              .bookingDetails {
                                  display: inherit;
                                  flex-direction: column;
  
                                  .row {
                                      display: inherit;
  
                                      .column {
                                          margin-left: 20px;
                                      }
                                  }
  
                                  .rowOne {
                                      margin-bottom: 40px;
                                  }
                              }
                          }
  
                          .subCharges {
                              table {
                                  width: 100%;
                                  border-collapse: collapse;
  
                                  color: #333;
                                  overflow: hidden;
  
                                  tbody{
                                      border: 1px solid #bfbfbf;
                                  }
  
                                  tr:first-child {
                                      background: #F5F5F5;
                                      color: #000;
                                  }
  
                                  tr {
                                      text-align: left;
                                      border: 1px solid #bfbfbf;
  
                                      border-bottom: none;
  
                                      th,
                                      td {
                                          padding: .5em 1em;
                                      }
  
                                      th{
                                          font-size: 18px;
                                      }
  
                                      td{
                                          font-size: 15px;
                                      }
                                  }
                              }
                          }
  
                          .totalChargeBox{
                              display: flex;
                              justify-content: space-between;
  
                              .note{
                                  width: 50%;
  
                                  p{
                                      width: 90%;
                                      margin-top: 30px;
                                  }
                              }
  
                              .total{
                                  width: 45%;
                                  table{
                                      width: 100%;
                                      border-collapse: collapse;
  
                                      /* color: #333; */
                                      overflow: hidden;
                                      tbody{
                                          /* border: 1px solid #bfbfbf; */
  
                                          tr:first-child{
                                              border-top: 0;
                                          }
  
                                          tr{
                                              background: #F5F5F5;
                                              color: #000;
                                              border: 1px solid #bfbfbf;
                                              border-bottom: none;
                                              width: max-content;
  
                                              th{
                                                  padding: .5em 1em;
                                                  width: max-content;
  
                                                  span{
                                                      font-size: 10px;
                                                  }
                                              }
  
                                              th:first-child{
                                                  width: 60%;
                                                  padding-right: 20px;
  
                                                  text-align: right;
                                              }
  
                                              th:last-child{
                                                  width: 40%;
                                                  text-align: left;
  
                                                  font-size: 15px;
                                              }
                                          }
  
                                          tr:last-child{
                                              border-bottom: 1px solid #bfbfbf;
                                          }
                                      }
                                  }
                              }
                          }
                      }
  
                      .footer{
                          margin-top: 40px;
                          display: flex;
                          justify-content: center;
  
                          div{
                              width: 60%;
                              display: inherit;
                              flex-direction: column;
                              align-items: center;
  
                              svg{
                                  height: 30px;
                                  width: auto;
                                  margin-bottom: 20px;
                              }
  
                              p{
                                  text-align: center;
                              }
                          }
                      }
                  }
              }
  
              .divider {
                  height: 1.5px;
                  background-color: #DADADA;
              }
  
              .sb10 {
                  margin-bottom: 10px;
              }
  
              .sb5 {
                  margin-bottom: 7px;
              }
          </style>
      </head>
  
      <body>
          <div class="parentContainer" id="element-to-print">
              <div class="childContainer">
                  <div class="header">
                      <svg width="387" height="84" viewBox="0 0 387 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M84.7781 5.85967L83.7357 12.1109C55.5922 9.14152 29.3596 11.017 22.7581 29.4581C17.4768 44.211 36.1928 51.4416 46.211 53.2127L52.4651 36.1782L31.6181 35.3968L32.6604 25.2385H74.3546C78.663 25.2385 78.8135 28.0516 78.3503 29.4581L68.9691 55.0881C77.0183 54.8797 93.3254 51.3061 94.1593 38.6786C94.9932 26.0512 71.9224 22.5817 60.2828 22.4255L62.02 12.1109C79.3344 11.0213 121.715 18.8051 116.57 45.0861C112.483 65.9619 79.2189 69.4659 64.2785 68.8408L58.1981 84H37.6985L36.8298 79.4679L41.173 65.0901C19.9784 62.277 0 49.6183 0 31.1772C0 16.4243 15.8669 8.15181 23.8004 5.85967C36.3429 1.17856 70.5018 -4.57222 84.7781 5.85967Z"
                              fill="url(#paint0_linear_1518_651)" />
                          <path
                              d="M160.271 36.7337C159.992 35.8324 159.609 35.0257 159.119 34.3136C158.641 33.5903 158.062 32.9728 157.383 32.4609C156.716 31.9491 155.948 31.5652 155.08 31.3093C154.212 31.0423 153.266 30.9087 152.243 30.9087C150.407 30.9087 148.771 31.3705 147.336 32.294C145.9 33.2176 144.771 34.575 143.947 36.3665C143.135 38.1468 142.729 40.3165 142.729 42.8757C142.729 45.4571 143.135 47.6436 143.947 49.435C144.76 51.2264 145.889 52.5895 147.336 53.5241C148.782 54.4477 150.462 54.9094 152.376 54.9094C154.112 54.9094 155.614 54.5756 156.882 53.908C158.162 53.2404 159.147 52.2946 159.837 51.0707C160.527 49.8356 160.871 48.3891 160.871 46.7312L162.273 46.9482H152.994V42.108H166.863V46.2138C166.863 49.1402 166.24 51.6715 164.994 53.8079C163.748 55.9442 162.034 57.591 159.853 58.7482C157.672 59.8943 155.169 60.4673 152.343 60.4673C149.194 60.4673 146.429 59.7608 144.048 58.3477C141.678 56.9234 139.825 54.9039 138.49 52.2891C137.166 49.6631 136.504 46.5476 136.504 42.9425C136.504 40.183 136.893 37.7184 137.672 35.5486C138.462 33.3789 139.563 31.5374 140.977 30.0241C142.39 28.4998 144.048 27.3426 145.95 26.5526C147.853 25.7514 149.923 25.3509 152.159 25.3509C154.051 25.3509 155.814 25.629 157.45 26.1854C159.086 26.7306 160.538 27.5095 161.806 28.522C163.086 29.5346 164.137 30.7363 164.961 32.1271C165.784 33.518 166.324 35.0535 166.58 36.7337H160.271ZM172.584 60V34.3636H178.442V38.6364H178.709C179.177 37.1565 179.978 36.016 181.113 35.2148C182.259 34.4026 183.566 33.9964 185.035 33.9964C185.369 33.9964 185.741 34.0131 186.153 34.0465C186.576 34.0688 186.926 34.1077 187.205 34.1634V39.7212C186.949 39.6322 186.543 39.5543 185.986 39.4876C185.441 39.4097 184.912 39.3707 184.401 39.3707C183.299 39.3707 182.309 39.61 181.43 40.0884C180.562 40.5558 179.878 41.2067 179.377 42.0412C178.876 42.8757 178.626 43.8382 178.626 44.9286V60H172.584ZM198.137 60.5174C196.512 60.5174 195.049 60.2281 193.747 59.6495C192.457 59.0598 191.433 58.1919 190.676 57.0458C189.931 55.8997 189.558 54.4866 189.558 52.8065C189.558 51.36 189.825 50.1638 190.359 49.218C190.893 48.2723 191.622 47.5156 192.546 46.9482C193.469 46.3807 194.509 45.9523 195.667 45.663C196.835 45.3626 198.042 45.1456 199.288 45.0121C200.791 44.8563 202.009 44.7172 202.944 44.5948C203.878 44.4613 204.557 44.261 204.98 43.994C205.414 43.7158 205.631 43.2874 205.631 42.7088V42.6087C205.631 41.3513 205.258 40.3777 204.513 39.6879C203.767 38.998 202.693 38.6531 201.291 38.6531C199.811 38.6531 198.638 38.9757 197.77 39.6211C196.913 40.2665 196.334 41.0286 196.034 41.9077L190.392 41.1065C190.838 39.5488 191.572 38.2469 192.596 37.201C193.619 36.1439 194.871 35.3539 196.351 34.831C197.831 34.2969 199.466 34.0298 201.258 34.0298C202.493 34.0298 203.723 34.1745 204.946 34.4638C206.17 34.7531 207.289 35.2315 208.301 35.8991C209.314 36.5556 210.126 37.4513 210.738 38.5863C211.361 39.7212 211.673 41.1399 211.673 42.8423V60H205.864V56.4783H205.664C205.297 57.1905 204.78 57.8581 204.112 58.4812C203.455 59.0932 202.627 59.5883 201.625 59.9666C200.635 60.3338 199.472 60.5174 198.137 60.5174ZM199.706 56.0778C200.919 56.0778 201.97 55.8385 202.86 55.3601C203.75 54.8705 204.435 54.2251 204.913 53.424C205.403 52.6229 205.647 51.7494 205.647 50.8036V47.7827C205.458 47.9384 205.136 48.0831 204.679 48.2166C204.234 48.3501 203.734 48.467 203.177 48.5671C202.621 48.6673 202.07 48.7563 201.525 48.8342C200.98 48.912 200.507 48.9788 200.106 49.0344C199.205 49.1568 198.398 49.3571 197.686 49.6353C196.974 49.9135 196.412 50.3029 196 50.8036C195.589 51.2932 195.383 51.9274 195.383 52.7063C195.383 53.819 195.789 54.6591 196.601 55.2266C197.414 55.794 198.448 56.0778 199.706 56.0778ZM223.79 44.9787V60H217.748V34.3636H223.523V38.7198H223.823C224.413 37.2844 225.353 36.1439 226.644 35.2983C227.946 34.4527 229.554 34.0298 231.467 34.0298C233.237 34.0298 234.778 34.4081 236.091 35.1648C237.415 35.9214 238.438 37.0174 239.162 38.4528C239.896 39.8881 240.258 41.6295 240.247 43.6768V60H234.205V44.6115C234.205 42.898 233.76 41.5572 232.869 40.5891C231.99 39.6211 230.772 39.1371 229.214 39.1371C228.157 39.1371 227.217 39.3707 226.394 39.8381C225.581 40.2943 224.941 40.9563 224.474 41.8242C224.018 42.6921 223.79 43.7436 223.79 44.9787ZM255.902 60.4506C253.888 60.4506 252.086 59.9332 250.494 58.8984C248.903 57.8636 247.646 56.3615 246.722 54.392C245.799 52.4226 245.337 50.0303 245.337 47.2152C245.337 44.3667 245.804 41.9633 246.739 40.005C247.685 38.0355 248.959 36.5501 250.561 35.5486C252.163 34.5361 253.949 34.0298 255.919 34.0298C257.421 34.0298 258.656 34.2857 259.624 34.7976C260.592 35.2983 261.36 35.9047 261.927 36.6168C262.495 37.3178 262.934 37.9799 263.246 38.603H263.496V25.8182H269.555V60H263.613V55.9609H263.246C262.934 56.584 262.484 57.2461 261.894 57.9471C261.304 58.637 260.525 59.2267 259.557 59.7163C258.589 60.2058 257.371 60.4506 255.902 60.4506ZM257.588 55.4936C258.867 55.4936 259.958 55.1487 260.859 54.4588C261.76 53.7578 262.445 52.7842 262.912 51.538C263.379 50.2918 263.613 48.8397 263.613 47.1818C263.613 45.5239 263.379 44.083 262.912 42.859C262.456 41.6351 261.777 40.6837 260.876 40.005C259.986 39.3262 258.89 38.9869 257.588 38.9869C256.241 38.9869 255.118 39.3374 254.216 40.0384C253.315 40.7393 252.636 41.7074 252.18 42.9425C251.724 44.1776 251.496 45.5907 251.496 47.1818C251.496 48.7841 251.724 50.2139 252.18 51.4712C252.647 52.7174 253.332 53.7022 254.233 54.4254C255.145 55.1375 256.264 55.4936 257.588 55.4936ZM287.918 60V25.8182H300.737C303.362 25.8182 305.566 26.3078 307.346 27.2869C309.137 28.2661 310.489 29.6125 311.402 31.326C312.325 33.0284 312.787 34.9645 312.787 37.1342C312.787 39.3262 312.325 41.2734 311.402 42.9759C310.478 44.6783 309.115 46.0191 307.312 46.9982C305.51 47.9663 303.29 48.4503 300.653 48.4503H292.158V43.3597H299.819C301.354 43.3597 302.611 43.0927 303.591 42.5586C304.57 42.0245 305.293 41.2901 305.76 40.3555C306.239 39.4208 306.478 38.3471 306.478 37.1342C306.478 35.9214 306.239 34.8532 305.76 33.9297C305.293 33.0062 304.564 32.2885 303.574 31.7766C302.595 31.2537 301.332 30.9922 299.785 30.9922H294.11V60H287.918ZM324.816 60.5174C323.192 60.5174 321.729 60.2281 320.427 59.6495C319.136 59.0598 318.113 58.1919 317.356 57.0458C316.61 55.8997 316.238 54.4866 316.238 52.8065C316.238 51.36 316.505 50.1638 317.039 49.218C317.573 48.2723 318.302 47.5156 319.225 46.9482C320.149 46.3807 321.189 45.9523 322.346 45.663C323.515 45.3626 324.722 45.1456 325.968 45.0121C327.47 44.8563 328.689 44.7172 329.623 44.5948C330.558 44.4613 331.237 44.261 331.66 43.994C332.093 43.7158 332.31 43.2874 332.31 42.7088V42.6087C332.31 41.3513 331.938 40.3777 331.192 39.6879C330.447 38.998 329.373 38.6531 327.971 38.6531C326.491 38.6531 325.317 38.9757 324.449 39.6211C323.593 40.2665 323.014 41.0286 322.714 41.9077L317.072 41.1065C317.517 39.5488 318.252 38.2469 319.275 37.201C320.299 36.1439 321.551 35.3539 323.031 34.831C324.511 34.2969 326.146 34.0298 327.938 34.0298C329.173 34.0298 330.402 34.1745 331.626 34.4638C332.85 34.7531 333.968 35.2315 334.981 35.8991C335.993 36.5556 336.806 37.4513 337.418 38.5863C338.041 39.7212 338.352 41.1399 338.352 42.8423V60H332.544V56.4783H332.344C331.977 57.1905 331.459 57.8581 330.792 58.4812C330.135 59.0932 329.306 59.5883 328.305 59.9666C327.314 60.3338 326.152 60.5174 324.816 60.5174ZM326.385 56.0778C327.598 56.0778 328.65 55.8385 329.54 55.3601C330.43 54.8705 331.114 54.2251 331.593 53.424C332.082 52.6229 332.327 51.7494 332.327 50.8036V47.7827C332.138 47.9384 331.815 48.0831 331.359 48.2166C330.914 48.3501 330.413 48.467 329.857 48.5671C329.301 48.6673 328.75 48.7563 328.205 48.8342C327.659 48.912 327.187 48.9788 326.786 49.0344C325.885 49.1568 325.078 49.3571 324.366 49.6353C323.654 49.9135 323.092 50.3029 322.68 50.8036C322.268 51.2932 322.063 51.9274 322.063 52.7063C322.063 53.819 322.469 54.6591 323.281 55.2266C324.093 55.794 325.128 56.0778 326.385 56.0778ZM344.428 60V34.3636H350.286V38.6364H350.553C351.02 37.1565 351.821 36.016 352.956 35.2148C354.102 34.4026 355.41 33.9964 356.879 33.9964C357.212 33.9964 357.585 34.0131 357.997 34.0465C358.42 34.0688 358.77 34.1077 359.048 34.1634V39.7212C358.792 39.6322 358.386 39.5543 357.83 39.4876C357.285 39.4097 356.756 39.3707 356.244 39.3707C355.143 39.3707 354.153 39.61 353.274 40.0884C352.406 40.5558 351.721 41.2067 351.221 42.0412C350.72 42.8757 350.47 43.8382 350.47 44.9286V60H344.428ZM368.57 51.9553L368.554 44.6616H369.522L378.735 34.3636H385.795L374.462 46.9815H373.21L368.57 51.9553ZM363.062 60V25.8182H369.104V60H363.062ZM379.152 60L370.807 48.3335L374.879 44.0774L386.379 60H379.152Z"
                              fill="url(#paint1_linear_1518_651)" />
                          <defs>
                              <linearGradient id="paint0_linear_1518_651" x1="58.5" y1="0" x2="58.5" y2="84"
                                  gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#6C92AD" />
                                  <stop offset="1" stop-color="#012948" />
                              </linearGradient>
                              <linearGradient id="paint1_linear_1518_651" x1="260.677" y1="71" x2="260.323" y2="14"
                                  gradientUnits="userSpaceOnUse">
                                  <stop stop-color="#012948" />
                                  <stop offset="1" stop-color="#6C92AD" />
                              </linearGradient>
                          </defs>
                      </svg>
                      <div>
                          <h2>Invoice</h2>
                          <p>Invoice Number: 12345</p>
                      </div>
                  </div>
                  <div class="divider"></div>
                  <div class="invoiceNumber">
                      <p><strong>Guest Name: </strong>${data.name}</p>
                      <p><strong>Booking Date: </strong>12.2.22</p>
                  </div>
                  <div class="divider"></div>
                  <div class="bookingDetailBox">
                      <div class="guestBookingDetails">
                          <div class="guestDetails">
                              <p class="sb10"><strong>Customer Details: </strong></p>
                              <p class="sb5">${data.name}</p>
                              <p class="sb5">${data.phoneNumber}</p>
                              <p>${data.email}</p>
                          </div>
                          <div class="bookingDetails">
                              <div class="row rowOne">
                                  <div class="column">
                                      <p class="sb10"><strong>CheckIn:</strong></p>
                                      <p>${new Date(data.checkinDate).toISOString().substring(0, 10)}</p>
                                  </div>
                                  <div class="column">
                                      <p class="sb10"><strong>CheckOut:</strong></p>
                                      <p>${new Date(data.checkoutDate).toISOString().substring(0, 10)}</p>
                                  </div>
                                  <div class="column">
                                      <p class="sb10"><strong>Confirmed:</strong></p>
                                      <p>3 Nights</p>
                                  </div>
                              </div>
                              <div class="row">
                                  <div class="column">
                                      <p class="sb10"><strong>Reservation Id:</strong></p>
                                      <p>${data.reservationId}</p>
                                  </div>
                                  <div class="column">
                                      <p class="sb10"><strong>Rooms:</strong></p>
                                      <p>1 Room</p>
                                  </div>
                                  <div class="column">
                                      <p class="sb10"><strong>Payment Mode:</strong></p>
                                      <p>Gpay</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div class="subCharges">
                          <table>
                              <tbody>
                                  <tr>
                                      <th>Description</th>
                                      <th>Quantity</th>
                                      <th>Rate</th>
                                      <th>Price</th>
                                  </tr>
                                  <tr>
                                      <td>Room Charges</td>
                                      <td>3 Night * 1 Room</td>
                                      <td>900/-</td>
                                      <td>2700/-</td>
                                  </tr>
                                  <tr>
                                      <td>Service Charges</td>
                                      <td>-</td>
                                      <td>180/-</td>
                                      <td>180/-</td>
                                  </tr>
                                  <tr>
                                      <td>Breakfast</td>
                                      <td>3 Members</td>
                                      <td>70/-</td>
                                      <td>210/-</td>
                                  </tr>
                              </tbody>
                          </table>
                      </div>
                      <div class="totalChargeBox">
                          <div class="note">
                              <p><strong>Please Note: </strong>Amount payable is inclusive of central & state goods & services Tax act applicable slab rates. Please ask Hotel for invoice at the time of check-out.</p>
                          </div>
                          <div class="total">
                              <table>
                                  <tbody>
                                      <tr>
                                          <th>Subtotal: </th>
                                          <th>1234</th>
                                      </tr>
                                      <tr>
                                          <th><span>includes service tax charges</span> Tax: </th>
                                          <th>1234</th>
                                      </tr>
                                      <tr>
                                          <th>GST: </th>
                                          <th>1234</th>
                                      </tr>
                                      <tr>
                                          <th>Grand Total: </th>
                                          <th>1234</th>
                                      </tr>
                                      <tr>
                                          <th>Paid: </th>
                                          <th>1234</th>
                                      </tr>
                                      <tr>
                                          <th>Amount Due: </th>
                                          <th>1234</th>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
                  <div class="divider"></div>
                  <div class="footer">
                      <div>
                          <svg width="auto" height="30" viewBox="0 0 387 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                  d="M84.7781 5.85967L83.7357 12.1109C55.5922 9.14152 29.3596 11.017 22.7581 29.4581C17.4768 44.211 36.1928 51.4416 46.211 53.2127L52.4651 36.1782L31.6181 35.3968L32.6604 25.2385H74.3546C78.663 25.2385 78.8135 28.0516 78.3503 29.4581L68.9691 55.0881C77.0183 54.8797 93.3254 51.3061 94.1593 38.6786C94.9932 26.0512 71.9224 22.5817 60.2828 22.4255L62.02 12.1109C79.3344 11.0213 121.715 18.8051 116.57 45.0861C112.483 65.9619 79.2189 69.4659 64.2785 68.8408L58.1981 84H37.6985L36.8298 79.4679L41.173 65.0901C19.9784 62.277 0 49.6183 0 31.1772C0 16.4243 15.8669 8.15181 23.8004 5.85967C36.3429 1.17856 70.5018 -4.57222 84.7781 5.85967Z"
                                  fill="url(#paint0_linear_1518_651)" />
                              <path
                                  d="M160.271 36.7337C159.992 35.8324 159.609 35.0257 159.119 34.3136C158.641 33.5903 158.062 32.9728 157.383 32.4609C156.716 31.9491 155.948 31.5652 155.08 31.3093C154.212 31.0423 153.266 30.9087 152.243 30.9087C150.407 30.9087 148.771 31.3705 147.336 32.294C145.9 33.2176 144.771 34.575 143.947 36.3665C143.135 38.1468 142.729 40.3165 142.729 42.8757C142.729 45.4571 143.135 47.6436 143.947 49.435C144.76 51.2264 145.889 52.5895 147.336 53.5241C148.782 54.4477 150.462 54.9094 152.376 54.9094C154.112 54.9094 155.614 54.5756 156.882 53.908C158.162 53.2404 159.147 52.2946 159.837 51.0707C160.527 49.8356 160.871 48.3891 160.871 46.7312L162.273 46.9482H152.994V42.108H166.863V46.2138C166.863 49.1402 166.24 51.6715 164.994 53.8079C163.748 55.9442 162.034 57.591 159.853 58.7482C157.672 59.8943 155.169 60.4673 152.343 60.4673C149.194 60.4673 146.429 59.7608 144.048 58.3477C141.678 56.9234 139.825 54.9039 138.49 52.2891C137.166 49.6631 136.504 46.5476 136.504 42.9425C136.504 40.183 136.893 37.7184 137.672 35.5486C138.462 33.3789 139.563 31.5374 140.977 30.0241C142.39 28.4998 144.048 27.3426 145.95 26.5526C147.853 25.7514 149.923 25.3509 152.159 25.3509C154.051 25.3509 155.814 25.629 157.45 26.1854C159.086 26.7306 160.538 27.5095 161.806 28.522C163.086 29.5346 164.137 30.7363 164.961 32.1271C165.784 33.518 166.324 35.0535 166.58 36.7337H160.271ZM172.584 60V34.3636H178.442V38.6364H178.709C179.177 37.1565 179.978 36.016 181.113 35.2148C182.259 34.4026 183.566 33.9964 185.035 33.9964C185.369 33.9964 185.741 34.0131 186.153 34.0465C186.576 34.0688 186.926 34.1077 187.205 34.1634V39.7212C186.949 39.6322 186.543 39.5543 185.986 39.4876C185.441 39.4097 184.912 39.3707 184.401 39.3707C183.299 39.3707 182.309 39.61 181.43 40.0884C180.562 40.5558 179.878 41.2067 179.377 42.0412C178.876 42.8757 178.626 43.8382 178.626 44.9286V60H172.584ZM198.137 60.5174C196.512 60.5174 195.049 60.2281 193.747 59.6495C192.457 59.0598 191.433 58.1919 190.676 57.0458C189.931 55.8997 189.558 54.4866 189.558 52.8065C189.558 51.36 189.825 50.1638 190.359 49.218C190.893 48.2723 191.622 47.5156 192.546 46.9482C193.469 46.3807 194.509 45.9523 195.667 45.663C196.835 45.3626 198.042 45.1456 199.288 45.0121C200.791 44.8563 202.009 44.7172 202.944 44.5948C203.878 44.4613 204.557 44.261 204.98 43.994C205.414 43.7158 205.631 43.2874 205.631 42.7088V42.6087C205.631 41.3513 205.258 40.3777 204.513 39.6879C203.767 38.998 202.693 38.6531 201.291 38.6531C199.811 38.6531 198.638 38.9757 197.77 39.6211C196.913 40.2665 196.334 41.0286 196.034 41.9077L190.392 41.1065C190.838 39.5488 191.572 38.2469 192.596 37.201C193.619 36.1439 194.871 35.3539 196.351 34.831C197.831 34.2969 199.466 34.0298 201.258 34.0298C202.493 34.0298 203.723 34.1745 204.946 34.4638C206.17 34.7531 207.289 35.2315 208.301 35.8991C209.314 36.5556 210.126 37.4513 210.738 38.5863C211.361 39.7212 211.673 41.1399 211.673 42.8423V60H205.864V56.4783H205.664C205.297 57.1905 204.78 57.8581 204.112 58.4812C203.455 59.0932 202.627 59.5883 201.625 59.9666C200.635 60.3338 199.472 60.5174 198.137 60.5174ZM199.706 56.0778C200.919 56.0778 201.97 55.8385 202.86 55.3601C203.75 54.8705 204.435 54.2251 204.913 53.424C205.403 52.6229 205.647 51.7494 205.647 50.8036V47.7827C205.458 47.9384 205.136 48.0831 204.679 48.2166C204.234 48.3501 203.734 48.467 203.177 48.5671C202.621 48.6673 202.07 48.7563 201.525 48.8342C200.98 48.912 200.507 48.9788 200.106 49.0344C199.205 49.1568 198.398 49.3571 197.686 49.6353C196.974 49.9135 196.412 50.3029 196 50.8036C195.589 51.2932 195.383 51.9274 195.383 52.7063C195.383 53.819 195.789 54.6591 196.601 55.2266C197.414 55.794 198.448 56.0778 199.706 56.0778ZM223.79 44.9787V60H217.748V34.3636H223.523V38.7198H223.823C224.413 37.2844 225.353 36.1439 226.644 35.2983C227.946 34.4527 229.554 34.0298 231.467 34.0298C233.237 34.0298 234.778 34.4081 236.091 35.1648C237.415 35.9214 238.438 37.0174 239.162 38.4528C239.896 39.8881 240.258 41.6295 240.247 43.6768V60H234.205V44.6115C234.205 42.898 233.76 41.5572 232.869 40.5891C231.99 39.6211 230.772 39.1371 229.214 39.1371C228.157 39.1371 227.217 39.3707 226.394 39.8381C225.581 40.2943 224.941 40.9563 224.474 41.8242C224.018 42.6921 223.79 43.7436 223.79 44.9787ZM255.902 60.4506C253.888 60.4506 252.086 59.9332 250.494 58.8984C248.903 57.8636 247.646 56.3615 246.722 54.392C245.799 52.4226 245.337 50.0303 245.337 47.2152C245.337 44.3667 245.804 41.9633 246.739 40.005C247.685 38.0355 248.959 36.5501 250.561 35.5486C252.163 34.5361 253.949 34.0298 255.919 34.0298C257.421 34.0298 258.656 34.2857 259.624 34.7976C260.592 35.2983 261.36 35.9047 261.927 36.6168C262.495 37.3178 262.934 37.9799 263.246 38.603H263.496V25.8182H269.555V60H263.613V55.9609H263.246C262.934 56.584 262.484 57.2461 261.894 57.9471C261.304 58.637 260.525 59.2267 259.557 59.7163C258.589 60.2058 257.371 60.4506 255.902 60.4506ZM257.588 55.4936C258.867 55.4936 259.958 55.1487 260.859 54.4588C261.76 53.7578 262.445 52.7842 262.912 51.538C263.379 50.2918 263.613 48.8397 263.613 47.1818C263.613 45.5239 263.379 44.083 262.912 42.859C262.456 41.6351 261.777 40.6837 260.876 40.005C259.986 39.3262 258.89 38.9869 257.588 38.9869C256.241 38.9869 255.118 39.3374 254.216 40.0384C253.315 40.7393 252.636 41.7074 252.18 42.9425C251.724 44.1776 251.496 45.5907 251.496 47.1818C251.496 48.7841 251.724 50.2139 252.18 51.4712C252.647 52.7174 253.332 53.7022 254.233 54.4254C255.145 55.1375 256.264 55.4936 257.588 55.4936ZM287.918 60V25.8182H300.737C303.362 25.8182 305.566 26.3078 307.346 27.2869C309.137 28.2661 310.489 29.6125 311.402 31.326C312.325 33.0284 312.787 34.9645 312.787 37.1342C312.787 39.3262 312.325 41.2734 311.402 42.9759C310.478 44.6783 309.115 46.0191 307.312 46.9982C305.51 47.9663 303.29 48.4503 300.653 48.4503H292.158V43.3597H299.819C301.354 43.3597 302.611 43.0927 303.591 42.5586C304.57 42.0245 305.293 41.2901 305.76 40.3555C306.239 39.4208 306.478 38.3471 306.478 37.1342C306.478 35.9214 306.239 34.8532 305.76 33.9297C305.293 33.0062 304.564 32.2885 303.574 31.7766C302.595 31.2537 301.332 30.9922 299.785 30.9922H294.11V60H287.918ZM324.816 60.5174C323.192 60.5174 321.729 60.2281 320.427 59.6495C319.136 59.0598 318.113 58.1919 317.356 57.0458C316.61 55.8997 316.238 54.4866 316.238 52.8065C316.238 51.36 316.505 50.1638 317.039 49.218C317.573 48.2723 318.302 47.5156 319.225 46.9482C320.149 46.3807 321.189 45.9523 322.346 45.663C323.515 45.3626 324.722 45.1456 325.968 45.0121C327.47 44.8563 328.689 44.7172 329.623 44.5948C330.558 44.4613 331.237 44.261 331.66 43.994C332.093 43.7158 332.31 43.2874 332.31 42.7088V42.6087C332.31 41.3513 331.938 40.3777 331.192 39.6879C330.447 38.998 329.373 38.6531 327.971 38.6531C326.491 38.6531 325.317 38.9757 324.449 39.6211C323.593 40.2665 323.014 41.0286 322.714 41.9077L317.072 41.1065C317.517 39.5488 318.252 38.2469 319.275 37.201C320.299 36.1439 321.551 35.3539 323.031 34.831C324.511 34.2969 326.146 34.0298 327.938 34.0298C329.173 34.0298 330.402 34.1745 331.626 34.4638C332.85 34.7531 333.968 35.2315 334.981 35.8991C335.993 36.5556 336.806 37.4513 337.418 38.5863C338.041 39.7212 338.352 41.1399 338.352 42.8423V60H332.544V56.4783H332.344C331.977 57.1905 331.459 57.8581 330.792 58.4812C330.135 59.0932 329.306 59.5883 328.305 59.9666C327.314 60.3338 326.152 60.5174 324.816 60.5174ZM326.385 56.0778C327.598 56.0778 328.65 55.8385 329.54 55.3601C330.43 54.8705 331.114 54.2251 331.593 53.424C332.082 52.6229 332.327 51.7494 332.327 50.8036V47.7827C332.138 47.9384 331.815 48.0831 331.359 48.2166C330.914 48.3501 330.413 48.467 329.857 48.5671C329.301 48.6673 328.75 48.7563 328.205 48.8342C327.659 48.912 327.187 48.9788 326.786 49.0344C325.885 49.1568 325.078 49.3571 324.366 49.6353C323.654 49.9135 323.092 50.3029 322.68 50.8036C322.268 51.2932 322.063 51.9274 322.063 52.7063C322.063 53.819 322.469 54.6591 323.281 55.2266C324.093 55.794 325.128 56.0778 326.385 56.0778ZM344.428 60V34.3636H350.286V38.6364H350.553C351.02 37.1565 351.821 36.016 352.956 35.2148C354.102 34.4026 355.41 33.9964 356.879 33.9964C357.212 33.9964 357.585 34.0131 357.997 34.0465C358.42 34.0688 358.77 34.1077 359.048 34.1634V39.7212C358.792 39.6322 358.386 39.5543 357.83 39.4876C357.285 39.4097 356.756 39.3707 356.244 39.3707C355.143 39.3707 354.153 39.61 353.274 40.0884C352.406 40.5558 351.721 41.2067 351.221 42.0412C350.72 42.8757 350.47 43.8382 350.47 44.9286V60H344.428ZM368.57 51.9553L368.554 44.6616H369.522L378.735 34.3636H385.795L374.462 46.9815H373.21L368.57 51.9553ZM363.062 60V25.8182H369.104V60H363.062ZM379.152 60L370.807 48.3335L374.879 44.0774L386.379 60H379.152Z"
                                  fill="url(#paint1_linear_1518_651)" />
                              <defs>
                                  <linearGradient id="paint0_linear_1518_651" x1="58.5" y1="0" x2="58.5" y2="84"
                                      gradientUnits="userSpaceOnUse">
                                      <stop stop-color="#6C92AD" />
                                      <stop offset="1" stop-color="#012948" />
                                  </linearGradient>
                                  <linearGradient id="paint1_linear_1518_651" x1="260.677" y1="71" x2="260.323" y2="14"
                                      gradientUnits="userSpaceOnUse">
                                      <stop stop-color="#012948" />
                                      <stop offset="1" stop-color="#6C92AD" />
                                  </linearGradient>
                              </defs>
                          </svg>
                          <p>th Floor, Plot No.22, Above Public Park, 145 Murphy Canyon Rd,Suite 100-18, San Diego CA 2028.</p>
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
      `
  }
  