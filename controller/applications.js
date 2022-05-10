const Student = require("../models/student");
const Application = require("../models/applications");
const Agent = require("../models/agent");
const res = require("express/lib/response");
function randomColor() {
	const color = [
		"#0xff7D71C6",
		"#0xff59B298",
		"#0xffBC6262",
		"#0xff4AA1B4",
		"#0xffD88B60",
		"#0xffB25999",
	];
	let index = Math.floor(Math.random() * color.length);

	return color[index];
}
//create application for student

const create = async function (req, res) {
	try {
		let color = randomColor();
		const body = req.body;
		const {
			studentID,
			agentID,
			universityName,
			location,
			applicationFees,
			courseName,
		} = body;

		const applicationOffer = {
			color,
			status: 2,
			...body,
		};
		if (!studentID || !agentID) {
			return res.status(400).send({
				message: "Important field missing",
				fieldName: "StudentID or AgentID",
			});
		}
		if (!universityName || !location || !location.city || !location.country) {
			return res.status(400).send({
				message: "University data missing",
				fieldName: "Some of university related data might be missing",
			});
		}
		if (!applicationFees || !courseName) {
			return res.status(400).send({
				message: "Application fee is missing or course Name",
				fieldName: "Please fill in some application fees amount or courseName",
			});
		}
		const studentFound = await Student.findOne({ studentID: studentID });
		if (!studentFound) {
			return res.status(500).send({
				message: "Student with given id doesn't exist",
			});
		}
		const agentFound = await Agent.findOne({ agentID: agentID });
		if (!agentFound) {
			return res.status(500).send({
				message: "Agent with given id doesn't exist",
			});
		} else if (agentFound.verified === false) {
			return res.status(500).send({
				message:
					"Agent with given id doesn't has verified and needs to add required documents",
				data: agentFound,
			});
		} else {
			applicationOffer.student = studentFound.id;
			applicationOffer.agent = agentFound.id;
			const applicationCreated = await Application.create(applicationOffer);
			applicationCreated
				.save()
				.then((doc) => {
					console.log(doc);
				})
				.catch((err) => {
					return res.status(500).send({ message: err.message });
				});
			studentFound.previousApplications.push(applicationCreated);
			//studentFound.previousApplications.agentID.push(agentID);
			console.log(applicationCreated);
			agentFound.applications.push(applicationCreated);
			agentFound
				.save()
				.then((doc) => {
					console.log(doc);
				})
				.catch((err) => {
					return res.status(500).send({ message: err.message });
				});
			studentFound.save((err, studentUpdated) => {
				console.log(studentUpdated);
				if (err || !studentUpdated) {
					throw Error(
						err.message
							? err.message
							: "Student updation problem something went wrong",
					);
				} else {
					return res.status(201).send({
						message: "Successfully created a application Offer",
						data: applicationCreated,
					});
				}
			});
		}
	} catch {
		(error) => {
			return res.status(500).send({ message: error.message });
		};
	}
};

// for favourite

const favourite = async function (req, res) {
	try {
		body = req.body.applicationID; // Apllicatio ID
		Application.findOneAndUpdate({ _id: body }, [
			{ $set: { favourite: { $eq: [false] } } },
		]).exec((err, favourite) => {
			if (err) return res.status(400).send(err);
			res.status(200).json({ success: true });
		});
	} catch {
		(error) => {
			return res.status(500).send({ message: error.message });
		};
	}
};

// // Find Favourite information inside Application Collection By Student id
// const favourated = async function (req, res) {
// 	try {
// 		Application.find({ favourite: req.body.favourite }).exec(
// 			(err, favourite) => {
// 				if (err) return res.status(400).send(err);

// 				// how can we know that i alreadt favourated this or not
// 				let result = false;

// 				res.status(200).json({ success: true });
// 			},
// 		);
// 	} catch {
// 		(error) => {
// 			return res.status(500).send({ message: error.message });
// 		};
// 	}
// };

// // add to favourite

// const favpurite = new favourite(body);
// Application.save((err, doc) => {
// 	if (err) return res.json({ success: false, err });
// });

// for progress bar
const progress = async function (req, res) {
	try {
		const progress = await Application.findOne({ progress: progress });
		if (!progress) {
			return res.status(500).send({
				message: "Can't able to update Progress",
			});
		} else if (progress <= 6) {
			const progressUpdate = await Application.updateOne({
				progress: doc.progress, // doc.progress take from body
			});
			await progressUpdate.save();

			return res.status(200).json({ sucess: true });
		}
	} catch {
		(error) => {
			return res.status(500).send({ message: error.message });
		};
	}
};

module.exports = {
	create,
	favourite,
	progress,
};
