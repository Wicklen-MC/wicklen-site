const target = new URL('mods.html', location.href);
target.search = location.search;
if (!target.searchParams.has('version')) target.searchParams.set('version', '0.5.0');
target.hash = location.hash;
location.replace(target.href);
