const config = require("config");
const { Invitation, validate } = require("../models/Invitation");
const { Station } = require("../models/Station");
const { Employee } = require("../models/Employee");
const { Designation } = require("../models/Designation");

const sendInvitation = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //look up the designation and station
  let designation = Designation.findById(req.body.designationId);
  let station = Station.findById(req.body.stationId);
  [station, designation] = await Promise.all([station, designation]);

  //Return if any of them is not found
  if (!station) return res.status(404).send("Station not found.");
  if (!designation) return res.status(404).send("Designation not found.");

  //compose invitation
  let invitation = Invitation({
    title: req.body.title,
    message: req.body.message,
    email: req.body.email,
    designation: req.body.designationId,
    station: req.body.stationId,
    expiresAt: req.body.expiresAt,
  });

  const applicationLink = `${invitation._id}`;
  invitation.applicationLink = applicationLink;

  //email
  [invitation] = await Promise.all([invitation.save()]);
  if (!invitation)
    return res.status(424).send("Sorry. Could not send invitation.");

  invitation.station = station;
  invitation.designation = designation;

  res.send(invitation);
};

const getInvitations = async (req, res) => {
  const invitations = await Invitation.find()
    .populate("designation")
    .populate("station");

  res.send(invitations);
};

const getInvitation = async (req, res) => {
  const invitations = await Invitation.findById(req.params.id)
    .populate("designation")
    .populate("station");

  res.send(invitations);
};

const updateInvitation = async (req, res) => {
  const invitation = await Invitation.findByIdAndUpdate(
    req.params.id,
    {
      expiresAt: req.body.expiresAt,
    },
    { new: true }
  );

  res.send(invitation);
};

const deleteInvitation = async (req, res) => {
  const invitation = await Invitation.findByIdAndRemove(req.params.id);
  if (!invitation) return res.status(404).send("Invitation not found.");

  const employee = await Employee.findById(invitation.employeeId);
  if (!employee) {
    //send mail that invitation has been retracted
  }

  res.send(invitation);
};

module.exports = {
  sendInvitation,
  getInvitations,
  getInvitation,
  updateInvitation,
  deleteInvitation,
};
