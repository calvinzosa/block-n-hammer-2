local s = ''
local function check(i,l)
	if #s == 0 then
		s = `\nexport type {i.Name} = {i.ClassName} & {\n`
	end
	local indent = string.rep('\t',l)
	for _, child in i:GetChildren() do
		local childType = `{indent}{child.Name}: {child.ClassName}`
		if #child:GetChildren() > 0 then
			s..=`{childType} & \{\n`
			check(child,l+1)
			s..=`{indent}};\n`
		else
			s..=`{childType};\n`
		end
	end
end
check(game.StarterGui.StartGui, 1)s..='};\n'print(s)
