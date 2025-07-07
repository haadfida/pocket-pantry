import { openDatabaseSync } from 'expo-sqlite';

export const db = openDatabaseSync('pocket_pantry.db');

export function setupDatabase(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      const schema = `
        BEGIN TRANSACTION;

        CREATE TABLE IF NOT EXISTS recipes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          image_uri TEXT,
          portions INTEGER DEFAULT 1,
          notes TEXT
        );

        CREATE TABLE IF NOT EXISTS ingredients (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          unit TEXT
        );

        CREATE TABLE IF NOT EXISTS recipe_ingredients (
          recipe_id INTEGER NOT NULL,
          ingredient_id INTEGER NOT NULL,
          quantity REAL NOT NULL,
          PRIMARY KEY (recipe_id, ingredient_id),
          FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
          FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS pantry (
          ingredient_id INTEGER PRIMARY KEY,
          quantity REAL NOT NULL DEFAULT 0,
          FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS grocery_list (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          ingredient_id INTEGER NOT NULL,
          quantity REAL NOT NULL,
          checked INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
        );

        CREATE TRIGGER IF NOT EXISTS trg_grocery_checked_update_pantry
        AFTER UPDATE OF checked ON grocery_list
        WHEN NEW.checked = 1 AND OLD.checked = 0
        BEGIN
          INSERT INTO pantry (ingredient_id, quantity)
            VALUES (NEW.ingredient_id, NEW.quantity)
          ON CONFLICT(ingredient_id) DO UPDATE SET quantity = quantity + NEW.quantity;
        END;

        CREATE VIEW IF NOT EXISTS v_recipes_cookable AS
        SELECT r.*
        FROM recipes r
        WHERE NOT EXISTS (
          SELECT 1
          FROM recipe_ingredients ri
          LEFT JOIN pantry p ON p.ingredient_id = ri.ingredient_id
          WHERE ri.recipe_id = r.id
            AND (p.quantity IS NULL OR p.quantity < ri.quantity)
        );

        COMMIT;
      `;

      db.execSync(schema);

      const existing = db.getFirstSync<{ cnt: number }>(
        'SELECT COUNT(*) as cnt FROM recipes'
      )?.cnt;

      if (!existing) {
        const seedSql = `
        BEGIN;

        INSERT OR IGNORE INTO ingredients (id, name, unit) VALUES
          (1,'Tomato','pcs'),
          (2,'Onion','pcs'),
          (3,'Garlic','clove'),
          (4,'Olive oil','tbsp'),
          (5,'Spaghetti','g'),
          (6,'Bread','slice'),
          (7,'Cheese','slice');

        INSERT OR IGNORE INTO recipes (id, title, portions, notes, image_uri) VALUES
          (1,'Spaghetti Marinara',2,'Simple pasta','https://images.unsplash.com/photo-1589308078054-83259d4aef36?auto=format&fit=crop&w=600&q=80'),
          (2,'Grilled Cheese Sandwich',1,'Classic comfort food','https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80');

        INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity) VALUES
          (1,5,200),
          (1,1,2),
          (1,2,1),
          (1,3,2),
          (1,4,2),
          (2,6,2),
          (2,7,2),
          (2,4,1);

        -- Ensure existing rows without image_uri get updated
        UPDATE recipes SET image_uri='https://images.unsplash.com/photo-1589308078054-83259d4aef36?auto=format&fit=crop&w=600&q=80' WHERE id=1 AND (image_uri IS NULL OR image_uri='');
        UPDATE recipes SET image_uri='https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=80' WHERE id=2 AND (image_uri IS NULL OR image_uri='');

        -- Seed grocery list with items
        INSERT OR IGNORE INTO grocery_list (id, ingredient_id, quantity, checked) VALUES
          (1,1,4,0),
          (2,2,2,0),
          (3,5,500,0);

        COMMIT;`;
        db.execSync(seedSql);
      }

      const groceryCount = db.getFirstSync<{ cnt: number }>('SELECT COUNT(*) as cnt FROM grocery_list')?.cnt;
      if (!groceryCount) {
        const grocerySeed = `
          INSERT OR IGNORE INTO grocery_list (ingredient_id, quantity, checked) VALUES
            (1,4,0),
            (2,2,0),
            (5,500,0);
        `;
        db.execSync(grocerySeed);
      }

      const pantryCount = db.getFirstSync<{ cnt: number }>('SELECT COUNT(*) as cnt FROM pantry')?.cnt;
      if (!pantryCount) {
        const pantrySeed = `
          INSERT OR IGNORE INTO pantry (ingredient_id, quantity) VALUES
            (1,4),
            (2,2),
            (3,3),
            (4,3),
            (5,500);
        `;
        db.execSync(pantrySeed);
      }

      resolve();
    } catch (err) {
      reject(err as Error);
    }
  });
}
