const config = require("config");
const { Invitation, validate } = require("../models/Invitation");
const { Station } = require("../models/Station");
const { Employee } = require("../models/Employee");

const sendInvitation = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //look up designation

  let station = Station.findById(req.body.stationId);

  [station] = await Promise.all([station]);

  if (!station) return res.status(404).send("Station not found.");

  let invitation = Invitation({
    title: req.body.title,
    message: req.body.message,
    desingation: req.body.designationId,
    station: req.body.stationId,
    expiresAt: req.body.expiresAt,
  });

  //send mail
  [invitation] = await Promise.all([invitation.save()]);
  if (!invitation)
    return res.status(424).send("Sorry. Could not send invitation.");

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

const deleteInvitation = async (req, res) => {
  const invitation = await Invitation.findByIdAndRemove(req.params.id);
  if (!invitation) return res.status(404).send("Invitation not found.");

  const employee = await Employee.findById(invitation.employeeId);
  if (!employee) {
    //send mail that invitation has been cancelled
  }

  res.send(invitation);
};

module.exports = {
  sendInvitation,
  getInvitations,
  getInvitation,
  deleteInvitation,
};
