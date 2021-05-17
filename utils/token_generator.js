const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const { InvalidParamsException } = require("./exceptions");

const TokenGenerator = class TokenGenerator {
  constructor(appId, appCertificate) {
    this.appId = appId;
    this.appCertificate = appCertificate;
  }

  async process(uid, channel, role) {
    if (this.validator(uid, channel, role) != null)
      throw this.validator(uid, channel, role);

    const expirationTimeInSeconds = 3600;

    const currentTimestamp = Math.floor(Date.now() / 1000);

    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const _role = role == "PUBLISHER" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    const token = RtcTokenBuilder.buildTokenWithUid(
      this.appId,
      this.appCertificate,
      channel,
      uid,
      _role,
      privilegeExpiredTs
    );

    return { token, expires: privilegeExpiredTs };
  }

  validator = (uid, channel, role) => {
    let message = "Unprocessable Entity";
    let errors = {};

    let appIdErrors = [];
    let appCertificateErrors = [];
    let uidErrors = [];
    let channelErrors = [];
    let roleErrors = [];

    if (this.appId != null) {
      if (typeof this.appId != "string")
        appIdErrors.push(`App Id must be of type 'String'`);
      if (this.appId == "" || this.appId === "" || !this.appId.length)
        appIdErrors.push("App Id must not be empty!");
    } else appIdErrors.push(`Agora App ID is required!`);

    if (this.appCertificate != null) {
      if (typeof this.appCertificate != "string")
        appCertificateErrors.push(`App Certificate must be of type 'String'`);
      if (
        this.appCertificate == "" ||
        this.appCertificate === "" ||
        !this.appCertificate.length
      )
        appCertificateErrors.push("App Certificate must not be empty!");
    } else appCertificateErrors.push("Agora App Certificate is required!");

    if (uid != null) {
      if (typeof uid != "string")
        uidErrors.push(`User ID must be of type 'String'`);
      if (uid == "" || uid === "" || !uid.length)
        uidErrors.push("User ID cannot be empty");
    } else uidErrors.push("User ID is required to generate token!");

    if (channel != null) {
      if (typeof channel != "string")
        channelErrors.push(`Channel must be of type 'String'`);
      if (channel == "" || channel === "" || !channel.length)
        channelErrors.push("Channel cannot be blank!");
    } else channelErrors.push("Channel name is required to generate token!");

    if (role != null) {
      if (typeof role != "string")
        roleErrors.push(`User Role must be of type 'String'`);
      if (role == "" || role === "" || !role.length)
        roleErrors.push("User Role cannot be blank / empty!");
      if (role !== "PUBLISHER" || role !== "SUBSCRIBER")
        roleErrors.push("Valid User Roles are 'PUBLISHER' & 'SUBSCRIBER'");
    }

    if (appIdErrors.length) errors["app_id"] = appIdErrors;
    if (appCertificateErrors.length)
      errors["app_certificate_id"] = appCertificateErrors;
    if (uidErrors.length) errors["uid"] = uidErrors;
    if (channelErrors.length) errors["channel"] = channelErrors;
    if (roleErrors.length) errors["role"] = roleErrors;

    return !this.isEmpty(errors)
      ? new InvalidParamsException(message, errors)
      : null;
  };

  isEmpty = (obj) => Object.keys(obj).length === 0;

  toString = () =>
    `App Id: ${this.appId}, App Certificate: ${this.appCertificate}, User Id: ${this.uid}, Channel Name: ${this.channel}, Role: ${this.role}`;
};

module.exports = { TokenGenerator };
