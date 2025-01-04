class Solution:
    def vowelStrings(self, words: List[str], queries: List[List[int]]) -> List[int]:
        arr=[0]*len(words)
        for i in range(len(words)):
            if words[i][0] in "aeiou" and words[i][-1] in "aeiou":
                arr[i]=1
        prefix=[0]*len(words)
        prefix[0]=arr[0]
        for i in range(1,len(words)):
            prefix[i]=arr[i]+prefix[i-1]
        ans=[]
        for i in queries:
            start=i[0]
            end=i[1]
            if start==0:
                sub=0
            else:
                sub=prefix[start-1]
            ans.append(prefix[end]-sub)
        return ans
