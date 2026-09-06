import os
import json
from pathlib import Path
from PIL import Image

def optimize_assets():
    source_dir = Path("Portfolio")
    dest_dir = Path("public/projects")
    db_path = Path("portfolio_db.json")

    os.makedirs(dest_dir, exist_ok=True)

    with open(db_path, "r", encoding="utf-8") as f:
        db = json.load(f)

    total_size_before = 0
    total_size_after = 0

    for item in db:
        new_asset_locations = []
        for asset in item.get("asset_locations", []):
            asset_path = Path(asset)
            
            try:
                rel_path = asset_path.relative_to("Portfolio")
            except ValueError:
                rel_path = Path(asset_path.name)

            dest_asset_path = dest_dir / rel_path.with_suffix(".webp")
            os.makedirs(dest_asset_path.parent, exist_ok=True)

            if asset_path.exists():
                try:
                    total_size_before += asset_path.stat().st_size
                    with Image.open(asset_path) as img:
                        # Convert to RGBA first if image is P (palette) with transparency or similar
                        if img.mode not in ('RGB', 'RGBA'):
                            img = img.convert('RGBA')
                        img.save(dest_asset_path, format="webp", quality=85)
                    total_size_after += dest_asset_path.stat().st_size
                    print(f"Optimized: {asset_path} -> {dest_asset_path}")
                except Exception as e:
                    print(f"Error processing {asset_path}: {e}")
            else:
                print(f"File not found: {asset_path}")

            # For web paths, use forward slashes
            new_rel_path = f"/projects/{rel_path.with_suffix('.webp').as_posix()}"
            new_asset_locations.append(new_rel_path)

        item["asset_locations"] = new_asset_locations

    with open(db_path, "w", encoding="utf-8") as f:
        json.dump(db, f, indent=2)
    
    print("Updated portfolio_db.json")
    print(f"Total size before: {total_size_before / (1024*1024):.2f} MB")
    print(f"Total size after: {total_size_after / (1024*1024):.2f} MB")
    print(f"Reduction: {(1 - total_size_after/total_size_before)*100 if total_size_before else 0:.2f}%")

if __name__ == "__main__":
    optimize_assets()
