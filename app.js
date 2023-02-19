const { response } = require("express");
const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const port = 5002;
const cron = require("node-cron");

var email = process.env.recipient_email;
var myemail = process.env.sender_email;
var mypassword = process.env.application_password;

function sendEmail(name) {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: myemail,
        pass: mypassword,
      },
    });

    const mail_configs = {
      from: myemail,
      to: email,
      attachments: [
        {
          // utf-8 string as an attachment
          filename: "text1.txt",
          content: "hello world!",
        },
        {
          // binary buffer as an attachment
          filename: "text2.txt",
          content: new Buffer("hello world!", "utf-8"),
        },
        {
          path: `data:image/png;base64,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`,
        },
        {
          filename: "resume.pdf",
          path: "https://res.cloudinary.com/thito-holdings/image/upload/v1673289988/resume_4_ylclzl.pdf",
        },
      ],
      subject: "Testing Koding 101 Email",
      html: `<!DOCTYPE html>
      <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
      
      <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" type="text/css">
        <!--<![endif]-->
        <style>
          * {
            box-sizing: border-box;
          }
      
          body {
            margin: 0;
            padding: 0;
          }
      
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: inherit !important;
          }
      
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }
      
          p {
            line-height: inherit
          }
      
          .desktop_hide,
          .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
          }
      
          @media (max-width:700px) {
      
            .desktop_hide table.icons-inner,
            .social_block.desktop_hide .social-table {
              display: inline-block !important;
            }
      
            .icons-inner {
              text-align: center;
            }
      
            .icons-inner td {
              margin: 0 auto;
            }
      
            .fullMobileWidth,
            .image_block img.big,
            .row-content {
              width: 100% !important;
            }
      
            .mobile_hide {
              display: none;
            }
      
            .stack .column {
              width: 100%;
              display: block;
            }
      
            .mobile_hide {
              min-height: 0;
              max-height: 0;
              max-width: 0;
              overflow: hidden;
              font-size: 0px;
            }
      
            .desktop_hide,
            .desktop_hide table {
              display: table !important;
              max-height: none !important;
            }
      
            .reverse {
              display: table;
              width: 100%;
            }
      
            .reverse .column.first {
              display: table-footer-group !important;
            }
      
            .reverse .column.last {
              display: table-header-group !important;
            }
      
            .row-5 td.column.first .border,
            .row-5 td.column.last .border {
              padding-left: 0;
              padding-right: 0;
              border-top: 0;
              border-right: 0px;
              border-bottom: 0;
              border-left: 0;
            }
          }
        </style>
      </head>
      
      <body style="background-color: #f5d3ab; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
        <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5d3ab;">
          <tbody>
            <tr>
              <td>
                <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/bg_XMAS.png'); background-position: center top; background-repeat: no-repeat;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:25px;padding-left:10px;padding-right:10px;width:100%;padding-top:110px;">
                                      <div class="alignment" align="center" style="line-height:10px"><a href="www.example.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/Logo_christmas_light.png" style="display: block; height: auto; border: 0; width: 159px; max-width: 100%;" width="159" alt="Compnay logo" title="Compnay logo"></a></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="heading_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Permanent Marker', Impact, Charcoal, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>&nbsp;Merry</strong><strong> Christmas&nbsp;</strong> ${name} </h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #f5f5f5; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 39px;"><span style="font-size:26px;">Enjoy 40% off on all products</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:56px;width:318px;v-text-anchor:middle;" arcsize="8%" strokeweight="0.75pt" strokecolor="#C92727" fillcolor="#ffd8d8"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#c92727; font-family:Arial, sans-serif; font-size:22px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#c92727;background-color:#ffd8d8;border-radius:4px;width:auto;border-top:1px solid #C92727;font-weight:undefined;border-right:1px solid #C92727;border-bottom:1px solid #C92727;border-left:1px solid #C92727;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:22px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:22px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word;"><span style="line-height: 44px;" data-mce-style>Coupon Code: 40XMAS</span></span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #f5f5f5; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">*The code is valid until 06.01.2022*</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="image_block block-8" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate.png" style="display: block; height: auto; border: 0; width: 578px; max-width: 100%;" width="578" alt="Chocolate box" title="Chocolate box"></div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/bg_XMAS.png'); background-position: center top; background-repeat: no-repeat;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:25px;padding-left:10px;padding-right:10px;width:100%;padding-top:110px;">
                                      <div class="alignment" align="center" style="line-height:10px"><a href="www.example.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/Logo_christmas_light.png" style="display: block; height: auto; border: 0; width: 159px; max-width: 100%;" width="159" alt="Compnay logo" title="Compnay logo"></a></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="heading_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Permanent Marker', Impact, Charcoal, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>&nbsp;Merry</strong><strong> Christmas&nbsp;</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #f5f5f5; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 39px;"><span style="font-size:26px;">Enjoy 40% off on all products</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:56px;width:318px;v-text-anchor:middle;" arcsize="8%" strokeweight="0.75pt" strokecolor="#C92727" fillcolor="#ffd8d8"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#c92727; font-family:Arial, sans-serif; font-size:22px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#c92727;background-color:#ffd8d8;border-radius:4px;width:auto;border-top:1px solid #C92727;font-weight:undefined;border-right:1px solid #C92727;border-bottom:1px solid #C92727;border-left:1px solid #C92727;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:22px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:22px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word;"><span style="line-height: 44px;" data-mce-style>Coupon Code: 40XMAS</span></span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #f5f5f5; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">*The code is valid until 06.01.2022*</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="image_block block-8" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate.png" style="display: block; height: auto; border: 0; width: 578px; max-width: 100%;" width="578" alt="Chocolate box" title="Chocolate box"></div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/bg_XMAS.png'); background-position: center top; background-repeat: no-repeat;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 0px; padding-bottom: 0px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:25px;padding-left:10px;padding-right:10px;width:100%;padding-top:110px;">
                                      <div class="alignment" align="center" style="line-height:10px"><a href="www.example.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/Logo_christmas_light.png" style="display: block; height: auto; border: 0; width: 159px; max-width: 100%;" width="159" alt="Compnay logo" title="Compnay logo"></a></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="heading_block block-4" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: 'Permanent Marker', Impact, Charcoal, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>&nbsp;Merry</strong><strong> Christmas&nbsp;</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #f5f5f5; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: right; mso-line-height-alt: 39px;"><span style="font-size:26px;">Enjoy 40% off on all products</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:56px;width:318px;v-text-anchor:middle;" arcsize="8%" strokeweight="0.75pt" strokecolor="#C92727" fillcolor="#ffd8d8"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#c92727; font-family:Arial, sans-serif; font-size:22px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#c92727;background-color:#ffd8d8;border-radius:4px;width:auto;border-top:1px solid #C92727;font-weight:undefined;border-right:1px solid #C92727;border-bottom:1px solid #C92727;border-left:1px solid #C92727;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:22px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:22px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word;"><span style="line-height: 44px;" data-mce-style>Coupon Code: 40XMAS</span></span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #f5f5f5; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="font-size:15px;">*The code is valid until 06.01.2022*</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="image_block block-8" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="big" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate.png" style="display: block; height: auto; border: 0; width: 578px; max-width: 100%;" width="578" alt="Chocolate box" title="Chocolate box"></div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5d3ab; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/bg_choco_1.png'); background-position: center top; background-repeat: no-repeat;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:90px;padding-bottom:5px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/choco.png" style="display: block; height: auto; border: 0; width: 340px; max-width: 100%;" width="340" alt="Mixing chocolate" title="Mixing chocolate"></div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:95px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #bf0000; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">DISCOVER YOUR TASTE</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="heading_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-left:10px;padding-top:10px;text-align:center;width:100%;">
                                      <h1 style="margin: 0; color: #333333; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Magical Chocolate</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit consectetuer adipiscing elit.</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;"><span style="text-decoration:line-through;">40.99€</span>&nbsp; <strong><span style="font-size:20px;">23.99</span></strong></span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-7" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:95px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:left;">
                                      <div class="alignment" align="left">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:179px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#171B1B" fillcolor="#171b1b"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#171b1b;border-radius:4px;width:auto;border-top:1px solid #171B1B;font-weight:undefined;border-right:1px solid #171B1B;border-bottom:1px solid #171B1B;border-left:1px solid #171B1B;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Explore Now!</span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5d3ab; background-position: center top;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr class="reverse">
                              <td class="column column-1 first" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <div class="border">
                                  <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                    <tr>
                                      <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:80px;">
                                        <div style="font-family: sans-serif">
                                          <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #bf0000; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                            <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">DISCOVER YOUR TASTE</span></p>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                  <table class="heading_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="pad" style="padding-left:10px;padding-top:10px;text-align:center;width:100%;">
                                        <h1 style="margin: 0; color: #333333; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Chocolate Cookies</strong></h1>
                                      </td>
                                    </tr>
                                  </table>
                                  <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                    <tr>
                                      <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                        <div style="font-family: sans-serif">
                                          <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                            <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit consectetuer adipiscing elit.</span></p>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                  <table class="text_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                    <tr>
                                      <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                        <div style="font-family: sans-serif">
                                          <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                            <p style="margin: 0; font-size: 14px; text-align: left; mso-line-height-alt: 24px;"><span style="font-size:16px;"><span style="text-decoration:line-through;">40.99€</span>&nbsp; <strong><span style="font-size:20px;">23.99</span></strong></span></p>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                  <table class="button_block block-7" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="pad" style="padding-bottom:80px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:left;">
                                        <div class="alignment" align="left">
                                          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:179px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#171B1B" fillcolor="#171b1b"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#171b1b;border-radius:4px;width:auto;border-top:1px solid #171B1B;font-weight:undefined;border-right:1px solid #171B1B;border-bottom:1px solid #171B1B;border-left:1px solid #171B1B;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Explore Now!</span></span></a>
                                          <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                              <td class="column column-2 last" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <div class="border">
                                  <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tr>
                                      <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:85px;padding-bottom:85px;">
                                        <div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate_1.png" style="display: block; height: auto; border: 0; width: 340px; max-width: 100%;" width="340" alt="White chocolate" title="White chocolate"></div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b; background-image: url('https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/bg_dark_area.png'); background-position: center top; background-repeat: no-repeat;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:90px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #bf0000; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">DISCOVER YOUR TASTE</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-left:10px;padding-top:10px;text-align:center;width:100%;">
                                      <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Gift Basket</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #c2c2c2; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit consectetuer adipiscing elit.</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #fbfbfb; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;"><span style="text-decoration:line-through;">40.99€</span>&nbsp; <strong><span style="font-size:20px;">23.99</span></strong></span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:165px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#C92727" fillcolor="#c92727"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#c92727;border-radius:4px;width:auto;border-top:1px solid #C92727;font-weight:undefined;border-right:1px solid #C92727;border-bottom:1px solid #C92727;border-left:1px solid #C92727;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Order Now!</span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="image_block block-7" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:70px;padding-left:10px;padding-right:10px;padding-top:25px;width:100%;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="fullMobileWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/Christmas_chocolate.png" style="display: block; height: auto; border: 0; width: 476px; max-width: 100%;" width="476" alt="Chocolate Christmas Basket" title="Chocolate Christmas Basket"></div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-7" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f5d3ab; background-position: center top;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="text_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:65px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #bf0000; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">DISCOVER YOUR TASTE</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-left:10px;padding-top:10px;text-align:center;width:100%;">
                                      <h1 style="margin: 0; color: #333333; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 62px; font-weight: normal; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Create Your Own</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:50px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit consectetuer adipiscing elit.</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-8" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 8px solid #171B1B; border-left: 8px solid #171B1B; border-right: 8px solid #171B1B; border-top: 8px solid #171B1B; vertical-align: top;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:35px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="fullMobileWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate_balls_2.png" style="display: block; height: auto; border: 0; width: 169px; max-width: 100%;" width="169" alt="Chocolate in Black Box" title="Chocolate in Black Box"></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 27px;"><span style="font-size:18px;">Lorem ipsum dolor sit</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;"><span style="text-decoration:line-through;">40.99€</span>&nbsp; <strong><span style="font-size:20px;">23.99</span></strong></span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:45px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:179px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#171B1B" fillcolor="#171b1b"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#171b1b;border-radius:4px;width:auto;border-top:1px solid #171B1B;font-weight:undefined;border-right:1px solid #171B1B;border-bottom:1px solid #171B1B;border-left:1px solid #171B1B;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Explore Now!</span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; background-color: #171b1b; border-bottom: 8px solid #F5D3AB; border-left: 8px solid #F5D3AB; border-right: 8px solid #F5D3AB; border-top: 8px solid #F5D3AB; vertical-align: top;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:35px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="fullMobileWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate_box_white.png" style="display: block; height: auto; border: 0; width: 181px; max-width: 100%;" width="181" alt="Chocolate in White Box" title="Chocolate in White Box"></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #e9e9e9; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 27px;"><span style="font-size:18px;">Dark Chocolate Box</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #e8e8e8; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;"><span style="text-decoration:line-through;">40.99€</span>&nbsp; <strong><span style="font-size:20px;">23.99</span></strong></span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:45px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:139px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#C92727" fillcolor="#c92727"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#c92727;border-radius:4px;width:auto;border-top:1px solid #C92727;font-weight:undefined;border-right:1px solid #C92727;border-bottom:1px solid #C92727;border-left:1px solid #C92727;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Explore Now!</span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; border-bottom: 8px solid #171B1B; border-left: 8px solid #171B1B; border-right: 8px solid #171B1B; border-top: 8px solid #171B1B; vertical-align: top;">
                                <table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;padding-top:30px;">
                                      <div class="alignment" align="center" style="line-height:10px"><img class="fullMobileWidth" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/chocolate_ball.png" style="display: block; height: auto; border: 0; width: 179px; max-width: 100%;" width="179" alt="Chocolate in Black Box" title="Chocolate in Black Box"></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 27px;"><span style="font-size:18px;">Lorem ipsum dolor sit</span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 14px; mso-line-height-alt: 21px; color: #333333; line-height: 1.5; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 24px;"><span style="font-size:16px;"><span style="text-decoration:line-through;">40.99€</span>&nbsp; <strong><span style="font-size:20px;">23.99</span></strong></span></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="button_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:45px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:center;">
                                      <div class="alignment" align="center">
                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="www.example.com" style="height:44px;width:179px;v-text-anchor:middle;" arcsize="10%" strokeweight="0.75pt" strokecolor="#171B1B" fillcolor="#171b1b"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="www.example.com" target="_blank" style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#171b1b;border-radius:4px;width:auto;border-top:1px solid #171B1B;font-weight:undefined;border-right:1px solid #171B1B;border-bottom:1px solid #171B1B;border-left:1px solid #171B1B;padding-top:5px;padding-bottom:5px;font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:40px;padding-right:40px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Explore Now!</span></span></a>
                                        <!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-9" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <div class="spacer_block" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-10" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <div class="spacer_block" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;width:100%;padding-right:0px;padding-top:5px;">
                                      <div class="alignment" align="left" style="line-height:10px"><a href="www.example.com" target="_blank" style="outline:none" tabindex="-1"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/5091/Logo_christmas_light.png" style="display: block; height: auto; border: 0; width: 159px; max-width: 100%;" width="159" alt="company logo" title="company logo"></a></div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 24px; color: #ffffff; line-height: 2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 28px;">Lorem ipsum dolor sit amet, consectetuer adipiscing elit,&nbsp;</p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td class="column column-2" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-left:20px;text-align:center;width:100%;padding-top:5px;">
                                      <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Links</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #ffffff;" rel="noopener">Chocolate Basket</a></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #ffffff;" rel="noopener">Products</a></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #ffffff;" rel="noopener">Offers</a></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:15px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #ffffff;" rel="noopener">Unsubscribe</a></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                              <td class="column column-3" width="33.333333333333336%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-left:20px;text-align:center;width:100%;padding-top:5px;">
                                      <h1 style="margin: 0; color: #ffffff; direction: ltr; font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: normal; line-height: 200%; text-align: left; margin-top: 0; margin-bottom: 0;"><strong>Contact</strong></h1>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #ffffff;" rel="noopener">Info@company.com</a></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="text_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:20px;padding-top:10px;">
                                      <div style="font-family: sans-serif">
                                        <div class style="font-size: 12px; mso-line-height-alt: 14.399999999999999px; color: #a9a9a9; line-height: 1.2; font-family: Helvetica Neue, Helvetica, Arial, sans-serif;">
                                          <p style="margin: 0; font-size: 14px; mso-line-height-alt: 16.8px;"><a href="http://www.example.com" target="_blank" style="text-decoration: none; color: #ffffff;" rel="noopener">Help Center</a></p>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                                <table class="social_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="padding-bottom:15px;padding-left:10px;padding-right:10px;padding-top:10px;text-align:left;">
                                      <div class="alignment" align="left">
                                        <table class="social-table" width="144px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
                                          <tr>
                                            <td style="padding:0 4px 0 0;"><a href="https://www.facebook.com/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/facebook@2x.png" width="32" height="32" alt="Facebook" title="facebook" style="display: block; height: auto; border: 0;"></a></td>
                                            <td style="padding:0 4px 0 0;"><a href="https://www.twitter.com/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/twitter@2x.png" width="32" height="32" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
                                            <td style="padding:0 4px 0 0;"><a href="https://www.linkedin.com/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/linkedin@2x.png" width="32" height="32" alt="Linkedin" title="linkedin" style="display: block; height: auto; border: 0;"></a></td>
                                            <td style="padding:0 4px 0 0;"><a href="https://www.instagram.com/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-only-logo-white/instagram@2x.png" width="32" height="32" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
                                          </tr>
                                        </table>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-12" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #171b1b;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <div class="spacer_block" style="height:55px;line-height:55px;font-size:1px;">&#8202;</div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row row-13" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                  <tbody>
                    <tr>
                      <td>
                        <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 680px;" width="680">
                          <tbody>
                            <tr>
                              <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                <table class="icons_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                  <tr>
                                    <td class="pad" style="vertical-align: middle; color: #9d9d9d; font-family: inherit; font-size: 15px; padding-bottom: 5px; padding-top: 5px; text-align: center;">
                                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tr>
                                          <td class="alignment" style="vertical-align: middle; text-align: center;">
                                            <!--[if vml]><table align="left" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;padding-left:0px;padding-right:0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"><![endif]-->
                                            <!--[if !vml]><!-->
                                            <table class="icons-inner" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block; margin-right: -4px; padding-left: 0px; padding-right: 0px;" cellpadding="0" cellspacing="0" role="presentation">
                                              <!--<![endif]-->
                                              <tr>
                                                <td style="vertical-align: middle; text-align: center; padding-top: 5px; padding-bottom: 5px; padding-left: 5px; padding-right: 6px;"><a href="https://www.designedwithbee.com/" target="_blank" style="text-decoration: none;"><img class="icon" alt="Designed with BEE" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/53601_510656/Signature/bee.png" height="32" width="34" align="center" style="display: block; height: auto; margin: 0 auto; border: 0;"></a></td>
                                                <td style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 15px; color: #9d9d9d; vertical-align: middle; letter-spacing: undefined; text-align: center;"><a href="https://www.designedwithbee.com/" target="_blank" style="color: #9d9d9d; text-decoration: none;">Designed with BEE</a></td>
                                              </tr>
                                            </table>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table><!-- End -->
      </body>
      
      </html>`,
    };
    transporter.sendMail(mail_configs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({ message: `An error has occured` });
      }
      return resolve({ message: "Email sent succesfuly" });
    });
  });
}

app.get("/sendEmail", (req, res) => {
  const { name } = req.query;
  sendEmail(name)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});

const task = () => {
  console.log("Running a task every minute");
};

cron.schedule("0 12 28 * *", sendEmail);

app.listen(port, () => {
  console.log(`nodemailerProject is listening at http://localhost:${port}`);
});
