import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PAGE_ID = process.env.PAGE_ID;
const START_BLOCK_ID = process.env.START_BLOCK_ID;
const END_BLOCK_ID = process.env.END_BLOCK_ID;

let totalBlocks = 0;
let todoBlocks = 0;
let resetBlocks = 0;
let inTargetRange = false;

async function getChildren(blockId) {
  const blocks = [];
  let cursor = undefined;

  while (true) {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    blocks.push(...response.results);

    if (!response.has_more) break;
    cursor = response.next_cursor;
  }

  return blocks;
}

async function traverse(blockId) {
  const children = await getChildren(blockId);

  for (const block of children) {
    totalBlocks++;

    if (block.id === START_BLOCK_ID) {
      inTargetRange = true;
      console.log(`Entered target range at: ${block.id}`);
    }

    if (inTargetRange && block.type === "to_do") {
      todoBlocks++;

      if (block.to_do.checked) {
        const text = block.to_do.rich_text
          ?.map((t) => t.plain_text)
          .join("")
          .trim();

        console.log(`Resetting: ${text || block.id}`);

        await notion.blocks.update({
          block_id: block.id,
          to_do: {
            rich_text: block.to_do.rich_text,
            checked: false,
            color: block.to_do.color,
          },
        });

        resetBlocks++;
      }
    }

    if (block.has_children) {
      await traverse(block.id);
    }

    if (block.id === END_BLOCK_ID) {
      console.log(`Exited target range at: ${block.id}`);
      inTargetRange = false;
    }
  }
}

(async () => {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error("Missing NOTION_TOKEN");
    }
    if (!PAGE_ID) {
      throw new Error("Missing PAGE_ID");
    }
    if (!START_BLOCK_ID) {
      throw new Error("Missing START_BLOCK_ID");
    }
    if (!END_BLOCK_ID) {
      throw new Error("Missing END_BLOCK_ID");
    }

    console.log("Starting targeted checklist reset...");
    console.log("--------------------------------");

    await traverse(PAGE_ID);

    console.log("--------------------------------");
    console.log(`Blocks scanned : ${totalBlocks}`);
    console.log(`Todo blocks    : ${todoBlocks}`);
    console.log(`Reset          : ${resetBlocks}`);
    console.log("Finished!");
  } catch (err) {
    console.error("Reset failed:");
    console.error(err);
    process.exit(1);
  }
})();
