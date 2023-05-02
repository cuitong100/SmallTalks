
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { auth } from "express-oauth2-jwt-bearer";
import { body, validationResult } from "express-validator";

const app = express();

//app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;

// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const { body } = require('express-validator');

const prisma = new PrismaClient();

dotenv.config();

const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  jwksUri: process.env.AUTH0_JWKS_URI,
  tokenSigningAlg: 'RS256'
});

app.use(express.json());

//const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000', // Replace this with your React app's origin
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors());
app.get("/ping", (req, res) => {
  res.send("pong");
});

function checkInput(title, content) {
  if (title == null || content == null) {
      return false;
  }
  return title !== '' && content !== '';
  // && !isNaN(price) && parseFloat(price) > 0;
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


// Route for getting all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


app.post("/verify-user", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;

    console.log("xxx", auth0Id);

    const user = await prisma.user.findUnique({
      where: {
        auth0Id,

      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      const newUser = await prisma.user.create({
        data: {
          auth0Id,
          username: generateRandomString(15),
        },
      });
      res.status(201).json(newUser);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
});


// Define a PORT and start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// // CREATE a new record
app.post(
  "/records",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("authorId").isInt().withMessage("Author ID must be a number"),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, authorId } = req.body;
    console.log("WEFCEWSFVERSDFGVERD" + title);

    try {
      const newRecord = await prisma.record.create({
        data: {
          title,
          content,
          authorId,
          stars: 0,
          likes: 0,
        },
      });
      res.json(newRecord);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.put(
  "/records/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const idInt = parseInt(req.params.id);
    const { title, content } = req.body;
    if (!checkInput(title, content)) {
      console.error("Invalid input!\n");
      res.status(401).send("invalid input values");
    } else {
      const updatedRecord = await prisma.record.update({
        where: {
          id: idInt,
        },
        data: {
          title,
          content,
        },
      });
      if (updatedRecord) {
        res.status(200).json(updatedRecord);
      } else {
        res.status(404).send(`Record id ${idInt} not found`);
      }
    }
  }
);


// deletes a record by id

app.delete("/records/:id", async(req, res) => {
  const idInt = parseInt(req.params.id);
  const deletedRecord = await prisma.record.delete({
    where: {
      id: idInt,
    }
  });
  if (deletedRecord) {
    res.status(200).json(deletedRecord);
  } else {
    res.status(404).send(`Record id ${idInt} not found`);
  }
});

// get all records , order by time

async function getLikeNumber({recordId}) {
  const likeNumber = await prisma.likes.count({
    where: {
      recordId
    }
  });
  return likeNumber;
}

app.get("/records", async(req, res) => {
  const fetchedRecords = await prisma.record.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (fetchedRecords) {
    for (let i = 0; i < fetchedRecords.length; ++i) {
      fetchedRecords[i].likes = await getLikeNumber({recordId: parseInt(fetchedRecords[i].id)});
    }
    res.status(200).json(fetchedRecords);
  } else {
    res.status(404).send(`Records not found`);
  }
});

// get specific record

app.get("/records/:id", async(req, res) => {
  const idInt = parseInt(req.params.id);
  const fetchedRecords = await prisma.record.findMany({
    where: {
      id: idInt,
    }
  });
  if (fetchedRecords) {
    for (let i = 0; i < fetchedRecords.length; ++i) {
      fetchedRecords[i].likes = await getLikeNumber({recordId: parseInt(fetchedRecords[i].id)});
    }
    res.status(200).json(fetchedRecords);
  } else {
    res.status(404).send(`Book id ${idInt} not found`);
  }
});

// get record-IDs of records liked by the user

async function likedRecordIds(userId) {
  console.log("userId", userId);
  const fetchedLikedIds = await prisma.likes.findMany({
    where: {
      userId: userId,
    }
  });
  return fetchedLikedIds.map(like => like.recordId);
}

app.get("/actions/ofuser/:userId", async(req, res) => {
  const userId = req.params.authorId.toString();
  const fetchedLikedIds = await likedRecordIds(userId);
  if (fetchedLikedIds) {
    res.status(200).json(fetchedLikedIds);
  } else {
    res.status(404).send(`Likes of user ${authorId} not found`);
  }
});

// get records created by the user

app.get("/records/ofuser/:authorId", async(req, res) => {
  const authorId = req.params.authorId.toString();
  const fetchedRecords = await prisma.record.findMany({
    where: {
      authorId: parseInt(authorId),
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  if (fetchedRecords) {
    for (let i = 0; i < fetchedRecords.length; ++i) {
      fetchedRecords[i].likes = await getLikeNumber({recordId: parseInt(fetchedRecords[i].id)});
    }
    res.status(200).json(fetchedRecords);
  } else {
    res.status(404).send(`Record of user id ${authorId} not found`);
  }
});

// get records liked by the user

app.get("/records/likedbyuser/:userId", async(req, res) => {
  const userId = parseInt(req.params.userId.toString());
  const fetchedLikedIds = await likedRecordIds(userId);

  const fetchedRecords = await prisma.record.findMany({
    where: {
      id: {
        in: fetchedLikedIds
      }
    },
    orderBy: {
      createdAt: 'desc',
    }
  });
  if (fetchedRecords) {
    for (let i = 0; i < fetchedRecords.length; ++i) {
      fetchedRecords[i].likes = await getLikeNumber({recordId: parseInt(fetchedRecords[i].id)});
    }
    res.status(200).json(fetchedRecords);
  } else {
    res.status(404).send(`Book id ${authorId} not found`);
  }
});

// increment the like number of the record
async function increRecordLike({ userId, recordId }) {
  const updatedRecord = await prisma.record.update({
    where: {
      id: recordId,
    },
    data: {
      likes: {
        increment: 1
      }
    },
  });
  return updatedRecord;
};

// decrement the like number of the record
async function decreRecordLike({ userId, recordId }) {
  const updatedRecord = await prisma.record.update({
    where: {
      id: recordId,
    },
    data: {
      likes: {
        decrement: 1
      }
    },
  });
  return updatedRecord;
};

// insert this like action to the Action table
async function insertLikeAction({ userId, recordId }) {
  try {
    const newAction = await prisma.likes.create({
      data: {
        recordId: recordId,
        userId: userId
      },
    });
    return newAction;
  } catch (error) {
    console.error(error);
  }
}

// delete this like action from the Action table
async function deleteLikeAction({ userId, recordId }) {
  try {
    const newAction = await prisma.likes.deleteMany({
      where: {
        AND: [
          {recordId},
          {userId: userId}
        ]
      },
    });
    return newAction;
  } catch (error) {
    console.error(error);
  }
}

// check if the record is liked by someone

async function recordIsLikedBy({userId, recordId}) {
  try {
    const action = await prisma.likes.findMany(
      {
        where: {
          userId, 
          recordId
        }
      }
    );
    if (action && action.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
}

// wrap this up into 'Like' Action

app.post(
  "/likes",
  async (req, res) => {
    const { userId, recordId } = req.body;
    console.log("HERE!!! + " + recordId);
    try {
      const isLiked = await recordIsLikedBy({userId, recordId});
      if (!isLiked) {
        // const _ = await increRecordLike({userId, recordId});
        const likeAction = await insertLikeAction({userId, recordId});
        if (likeAction) {
          res.status(200).json(likeAction);
        } else {
          res.status(404).send(`Like Action failed to create`);
        }
      } else {
        // const _ = await decreRecordLike({userId, recordId});
        const deletedAction = await deleteLikeAction({userId, recordId});
        if (deletedAction) {
          res.status(200).json(deletedAction);
        } else {
          res.status(404).send(`Like Action failed to delete`);
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong for like function" });
    }
  }
);

// get like number of a record

app.get("/likes/:recordId", async(req, res) => {
  const recordId = parseInt(req.params.recordId.toString());
  const fetchedLikes = await getLikeNumber({recordId});
  if (fetchedLikes != null) {
    res.status(200).json(fetchedLikes);
  } else {
    res.status(404).send(`Likes not found`);
  }
});
// Get user by auth0Id
app.get("/user", requireAuth, async (req, res) => {
  console.log("here")
  const auth0Id = req.auth.payload.sub;
  try {
    console.log("get user", req.user)
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });
    console.log("user in server", user)

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
});

// Update username by auth0Id
app.put("/user/:id",requireAuth,  async (req, res) => {
  try {
    const { username } = req.body;
    // console.log("username", username);
    if (!username) {
      res.status(400).json({ message: "Username is required" });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(req.params.id),
      },
      data: {
        username,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating username", error });
  }
});

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "Test endpoint works",
    name: "fakeUser",
    email: "fakeUser@example.com",
  });
});

app.post("/simpleuser", async (req, res) => {
  const { sub } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id: sub,
      },
    });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
})

