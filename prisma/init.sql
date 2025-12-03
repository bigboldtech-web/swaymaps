-- Create tables and indexes for initial schema
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "DecodeMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ownerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DecodeMap_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "MapUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mapId" TEXT NOT NULL,
    CONSTRAINT "MapUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MapUser_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "DecodeMap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "MapNode" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mapId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "kindLabel" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "noteId" TEXT,
    "posX" REAL NOT NULL,
    "posY" REAL NOT NULL,
    CONSTRAINT "MapNode_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "DecodeMap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MapNode_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "MapEdge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mapId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "label" TEXT,
    "noteId" TEXT,
    CONSTRAINT "MapEdge_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "DecodeMap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MapEdge_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "MapNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MapEdge_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "MapNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MapEdge_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mapId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Note_mapId_fkey" FOREIGN KEY ("mapId") REFERENCES "DecodeMap" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "MapNode_noteId_key" ON "MapNode"("noteId");
CREATE UNIQUE INDEX "MapEdge_noteId_key" ON "MapEdge"("noteId");
