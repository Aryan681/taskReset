import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PAGE_ID = process.env.PAGE_ID;

let totalBlocks = 0;
let todoBlocks = 0;
let resetBlocks = 0;

async function getChildren(blockId) {
  let blocks = [];
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

    if (block.type === "to_do") {
      todoBlocks++;

      if (block.to_do.checked) {
        console.log(`Resetting: ${block.id}`);

        await notion.blocks.update({
          block_id: block.id,
          to_do: {
            rich_text: block.to_do.rich_text,
            checked: false,
            color: block.to_do.color,
            children: [],
          },
        });

        resetBlocks++;
      }
    }

    if (block.has_children) {
      await traverse(block.id);
    }
  }
}

(async () => {
  console.log("Starting checklist reset...");
  console.log("--------------------------------");

  await traverse(PAGE_ID);

  console.log("--------------------------------");
  console.log(`Blocks scanned : ${totalBlocks}`);
  console.log(`Todo blocks    : ${todoBlocks}`);
  console.log(`Reset          : ${resetBlocks}`);
  console.log("Finished!");
})();
