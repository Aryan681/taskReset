import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PAGE_ID = process.env.PAGE_ID;
const START_BLOCK_ID = process.env.START_BLOCK_ID;
const END_BLOCK_ID = process.env.END_BLOCK_ID;

if (!PAGE_ID) throw new Error("Missing PAGE_ID");
if (!START_BLOCK_ID) throw new Error("Missing START_BLOCK_ID");
if (!END_BLOCK_ID) throw new Error("Missing END_BLOCK_ID");

let totalBlocks = 0;
let todoBlocks = 0;
let resetBlocks = 0;

async function getAllChildren(blockId) {
  const children = [];
  let cursor;

  while (true) {
    const res = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    children.push(...res.results);

    if (!res.has_more) break;
    cursor = res.next_cursor;
  }

  return children;
}

function getBlockText(block) {
  const t = block.type;
  if (
    ![
      "paragraph",
      "to_do",
      "heading_1",
      "heading_2",
      "heading_3",
      "bulleted_list_item",
      "numbered_list_item",
      "callout",
      "quote",
      "toggle",
    ].includes(t)
  ) {
    return "";
  }

  const richText = block[t]?.rich_text || [];
  return richText.map((x) => x.plain_text).join("").trim();
}

async function resetToDosInRange(parentBlockId) {
  const children = await getAllChildren(parentBlockId);

  let inRange = false;

  for (const block of children) {
    totalBlocks++;

    if (block.id === START_BLOCK_ID) {
      inRange = true;
      console.log(`Entered target range at: ${block.id}`);
      continue;
    }

    if (block.id === END_BLOCK_ID) {
      console.log(`Exited target range at: ${block.id}`);
      break;
    }

    if (inRange && block.type === "to_do") {
      todoBlocks++;

      if (block.to_do.checked) {
        const text = getBlockText(block);
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
  }
}

(async () => {
  try {
    console.log("Starting targeted checklist reset...");
    console.log("--------------------------------");

    await resetToDosInRange(PAGE_ID);

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
