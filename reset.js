import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const PAGE_ID = process.env.PAGE_ID;

// Any heading containing one of these keywords will be skipped
const SKIP_SECTION_KEYWORDS = ["Yearly Goals"];

let totalBlocks = 0;
let todoBlocks = 0;
let resetBlocks = 0;

async function getChildren(blockId) {
  let blocks = [];
  let cursor;

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

function getHeadingText(block) {
  if (
    block.type !== "heading_1" &&
    block.type !== "heading_2" &&
    block.type !== "heading_3"
  ) {
    return null;
  }

  return block[block.type].rich_text
    .map((t) => t.plain_text)
    .join("")
    .trim();
}

async function traverse(blockId, skipSection = false) {
  const children = await getChildren(blockId);

  for (let i = 0; i < children.length; i++) {
    const block = children[i];
    totalBlocks++;

    let currentSkip = skipSection;

    // Detect headings
    const heading = getHeadingText(block);

    if (heading) {
      currentSkip = SKIP_SECTION_KEYWORDS.some((keyword) =>
        heading.includes(keyword)
      );

      if (currentSkip) {
        console.log(`Skipping section: ${heading}`);
      }
    }

    // Reset only if not inside skipped section
    if (!currentSkip && block.type === "to_do") {
      todoBlocks++;

      if (block.to_do.checked) {
        console.log(
          `Resetting: ${
            block.to_do.rich_text.map((t) => t.plain_text).join("") ||
            block.id
          }`
        );

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
      await traverse(block.id, currentSkip);
    }
  }
}

(async () => {
  try {
    console.log("Starting checklist reset...");
    console.log("--------------------------------");

    await traverse(PAGE_ID);

    console.log("--------------------------------");
    console.log(`Blocks scanned : ${totalBlocks}`);
    console.log(`Todo blocks    : ${todoBlocks}`);
    console.log(`Reset          : ${resetBlocks}`);
    console.log("Finished!");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
